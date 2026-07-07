import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";
import { db, messagesTable, reactionsTable } from "@workspace/db";
import {
  DeleteMessageParams,
  AddReactionParams,
  AddReactionBody,
  RemoveReactionParams,
} from "@workspace/api-zod";
import { requireAuth, requireVerifiedMember, type AuthedRequest } from "../middlewares/auth";
import { fetchSingleMessageWithReactions } from "../lib/messageHelper";
import { broadcastReactionUpdate, broadcastMessageDelete } from "../ws";

const router: IRouter = Router();

// DELETE /messages/:messageId
router.delete("/messages/:messageId", requireAuth, requireVerifiedMember, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.messageId) ? req.params.messageId[0] : req.params.messageId;
  const params = DeleteMessageParams.safeParse({ messageId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = (req as AuthedRequest).userId;

  const [message] = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.id, params.data.messageId));

  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  // Only the author can delete their message
  if (message.userId !== userId) {
    res.status(403).json({ error: "You can only delete your own messages" });
    return;
  }

  await db.delete(messagesTable).where(eq(messagesTable.id, params.data.messageId));

  broadcastMessageDelete(params.data.messageId, message.channelId);
  res.sendStatus(204);
});

// POST /messages/:messageId/reactions — toggle a reaction
router.post("/messages/:messageId/reactions", requireAuth, requireVerifiedMember, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.messageId) ? req.params.messageId[0] : req.params.messageId;
  const params = AddReactionParams.safeParse({ messageId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = AddReactionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const userId = (req as AuthedRequest).userId;

  const [message] = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.id, params.data.messageId));

  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  // Toggle: if already reacted with this emoji, remove it; otherwise add it
  const [existing] = await db
    .select()
    .from(reactionsTable)
    .where(
      and(
        eq(reactionsTable.messageId, params.data.messageId),
        eq(reactionsTable.userId, userId),
        eq(reactionsTable.emoji, body.data.emoji),
      ),
    );

  if (existing) {
    await db.delete(reactionsTable).where(eq(reactionsTable.id, existing.id));
  } else {
    await db.insert(reactionsTable).values({
      messageId: params.data.messageId,
      userId,
      emoji: body.data.emoji,
    }).onConflictDoNothing();
  }

  const formatted = await fetchSingleMessageWithReactions(params.data.messageId, userId);
  if (!formatted) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  broadcastReactionUpdate(formatted);
  res.json(formatted);
});

// DELETE /messages/:messageId/reactions/:emoji
router.delete("/messages/:messageId/reactions/:emoji", requireAuth, requireVerifiedMember, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.messageId) ? req.params.messageId[0] : req.params.messageId;
  const rawEmoji = Array.isArray(req.params.emoji) ? req.params.emoji[0] : req.params.emoji;

  const params = RemoveReactionParams.safeParse({
    messageId: parseInt(rawId, 10),
    emoji: rawEmoji,
  });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = (req as AuthedRequest).userId;

  await db
    .delete(reactionsTable)
    .where(
      and(
        eq(reactionsTable.messageId, params.data.messageId),
        eq(reactionsTable.userId, userId),
        eq(reactionsTable.emoji, params.data.emoji),
      ),
    );

  const formatted = await fetchSingleMessageWithReactions(params.data.messageId, userId);
  if (!formatted) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  broadcastReactionUpdate(formatted);
  res.json(formatted);
});

export default router;
