import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, lt, and } from "drizzle-orm";
import { db, messagesTable } from "@workspace/db";
import {
  GetChannelMessagesParams,
  GetChannelMessagesQueryParams,
  SendMessageParams,
  SendMessageBody,
  GetPinnedMessageParams,
} from "@workspace/api-zod";
import { requireAuth, requireVerifiedMember, type AuthedRequest } from "../middlewares/auth";
import { CHANNELS, getChannel } from "../lib/channels";
import { fetchMessagesWithReactions, fetchSingleMessageWithReactions } from "../lib/messageHelper";
import { broadcastNewMessage } from "../ws";
import { getOrCreateUser } from "../lib/userProvisioning";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Rate limiting: userId → last message timestamp
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 1000;

// GET /channels — list all channels
router.get("/channels", requireAuth, requireVerifiedMember, async (_req, res): Promise<void> => {
  const channels = CHANNELS.map((c) => ({ ...c, unreadCount: 0 }));
  res.json(channels);
});

// GET /channels/:channelId/messages
router.get("/channels/:channelId/messages", requireAuth, requireVerifiedMember, async (req, res): Promise<void> => {
  const params = GetChannelMessagesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const query = GetChannelMessagesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const channel = getChannel(params.data.channelId);
  if (!channel) {
    res.status(404).json({ error: "Channel not found" });
    return;
  }

  const userId = (req as AuthedRequest).userId;
  const limit = query.data.limit ?? 50;
  const before = query.data.before;

  try {
    let messages;
    if (before != null) {
      const rows = await db
        .select()
        .from(messagesTable)
        .where(and(eq(messagesTable.channelId, params.data.channelId), lt(messagesTable.id, before)))
        .orderBy(desc(messagesTable.id))
        .limit(limit);

      const msgIds = rows.map((m) => m.id);
      const { reactionsTable } = await import("@workspace/db");
      const { inArray } = await import("drizzle-orm");

      const reactions = msgIds.length > 0
        ? await db.select().from(reactionsTable).where(inArray(reactionsTable.messageId, msgIds))
        : [];

      const reactionMap = new Map<number, Map<string, { count: number; userReacted: boolean }>>();
      for (const r of reactions) {
        if (!reactionMap.has(r.messageId)) reactionMap.set(r.messageId, new Map());
        const emojiMap = reactionMap.get(r.messageId)!;
        if (!emojiMap.has(r.emoji)) emojiMap.set(r.emoji, { count: 0, userReacted: false });
        const d = emojiMap.get(r.emoji)!;
        d.count++;
        if (r.userId === userId) d.userReacted = true;
      }

      messages = rows.map((m) => {
        const emojiMap = reactionMap.get(m.id) ?? new Map();
        return {
          id: m.id,
          channelId: m.channelId,
          userId: m.userId,
          username: m.username,
          avatarUrl: m.avatarUrl ?? null,
          content: m.content,
          createdAt: m.createdAt,
          reactions: Array.from(emojiMap.entries()).map(([emoji, d]) => ({ emoji, count: d.count, userReacted: d.userReacted })),
          isPinned: m.isPinned,
        };
      });
    } else {
      messages = await fetchMessagesWithReactions(params.data.channelId, userId, limit);
    }

    // Return in chronological order (oldest first for chat display)
    res.json(messages.reverse());
  } catch (err) {
    req.log.error({ err }, "Error fetching messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /channels/:channelId/messages — send a message
router.post("/channels/:channelId/messages", requireAuth, requireVerifiedMember, async (req, res): Promise<void> => {
  const params = SendMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = SendMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const channel = getChannel(params.data.channelId);
  if (!channel) {
    res.status(404).json({ error: "Channel not found" });
    return;
  }

  if (!channel.writable) {
    res.status(403).json({ error: "Channel is read-only" });
    return;
  }

  const userId = (req as AuthedRequest).userId;

  // Rate limiting
  const lastMsg = rateLimitMap.get(userId) ?? 0;
  if (Date.now() - lastMsg < RATE_LIMIT_MS) {
    res.status(429).json({ error: "Sending messages too fast. Please wait a moment." });
    return;
  }
  rateLimitMap.set(userId, Date.now());

  try {
    const user = await getOrCreateUser(userId);

    const username = user?.username ?? `user_${userId.slice(-6)}`;
    const avatarUrl = user?.avatarUrl ?? null;

    const [message] = await db
      .insert(messagesTable)
      .values({
        channelId: params.data.channelId,
        userId,
        username,
        avatarUrl,
        content: body.data.content,
        isPinned: false,
      })
      .returning();

    const formatted = {
      id: message.id,
      channelId: message.channelId,
      userId: message.userId,
      username: message.username,
      avatarUrl: message.avatarUrl ?? null,
      content: message.content,
      createdAt: message.createdAt,
      reactions: [],
      isPinned: message.isPinned,
    };

    // Broadcast to all WS clients
    broadcastNewMessage(formatted);

    res.status(201).json(formatted);
  } catch (err) {
    req.log.error({ err }, "Error sending message");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /channels/:channelId/pinned
router.get("/channels/:channelId/pinned", requireAuth, requireVerifiedMember, async (req, res): Promise<void> => {
  const params = GetPinnedMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const channel = getChannel(params.data.channelId);
  if (!channel) {
    res.status(404).json({ error: "Channel not found" });
    return;
  }

  const userId = (req as AuthedRequest).userId;

  try {
    const [pinned] = await db
      .select()
      .from(messagesTable)
      .where(and(eq(messagesTable.channelId, params.data.channelId), eq(messagesTable.isPinned, true)))
      .orderBy(desc(messagesTable.id))
      .limit(1);

    if (!pinned) {
      res.status(404).json({ error: "No pinned message" });
      return;
    }

    const formatted = await fetchSingleMessageWithReactions(pinned.id, userId);
    if (!formatted) {
      res.status(404).json({ error: "No pinned message" });
      return;
    }

    res.json(formatted);
  } catch (err) {
    req.log.error({ err }, "Error fetching pinned message");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
