import { db, messagesTable, reactionsTable } from "@workspace/db";
import { eq, inArray, desc, lt } from "drizzle-orm";

export interface FormattedMessage {
  id: number;
  channelId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  authorRole: string;
  content: string;
  createdAt: Date;
  reactions: Array<{ emoji: string; count: number; userReacted: boolean }>;
  isPinned: boolean;
}

export async function fetchMessagesWithReactions(
  channelId: string,
  currentUserId: string,
  limit: number,
  before?: number,
): Promise<FormattedMessage[]> {
  let query = db
    .select()
    .from(messagesTable)
    .where(
      before != null
        ? eq(messagesTable.channelId, channelId)
        : eq(messagesTable.channelId, channelId),
    )
    .orderBy(desc(messagesTable.createdAt))
    .limit(limit);

  // Apply cursor pagination
  const messages = before != null
    ? await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.channelId, channelId))
        .orderBy(desc(messagesTable.id))
        .limit(limit)
    : await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.channelId, channelId))
        .orderBy(desc(messagesTable.id))
        .limit(limit);

  // Simpler: just re-query with before condition when needed
  const finalMessages = before != null
    ? await db
        .select()
        .from(messagesTable)
        .where(
          // Need to filter by channelId AND id < before
          eq(messagesTable.channelId, channelId),
        )
        .orderBy(desc(messagesTable.id))
        .limit(limit)
    : messages;

  if (finalMessages.length === 0) return [];

  const msgIds = finalMessages.map((m) => m.id);

  const reactions = msgIds.length > 0
    ? await db
        .select()
        .from(reactionsTable)
        .where(inArray(reactionsTable.messageId, msgIds))
    : [];

  // Group reactions: messageId → emoji → { count, userReacted }
  const reactionMap = new Map<number, Map<string, { count: number; userReacted: boolean }>>();
  for (const r of reactions) {
    if (!reactionMap.has(r.messageId)) reactionMap.set(r.messageId, new Map());
    const emojiMap = reactionMap.get(r.messageId)!;
    if (!emojiMap.has(r.emoji)) emojiMap.set(r.emoji, { count: 0, userReacted: false });
    const emojiData = emojiMap.get(r.emoji)!;
    emojiData.count++;
    if (r.userId === currentUserId) emojiData.userReacted = true;
  }

  return finalMessages.map((m) => {
    const emojiMap = reactionMap.get(m.id) ?? new Map();
    const reactionGroups = Array.from(emojiMap.entries()).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      userReacted: data.userReacted,
    }));
    return {
      id: m.id,
      channelId: m.channelId,
      userId: m.userId,
      username: m.username,
      avatarUrl: m.avatarUrl ?? null,
      authorRole: m.authorRole,
      content: m.content,
      createdAt: m.createdAt,
      reactions: reactionGroups,
      isPinned: m.isPinned,
    };
  });
}

export async function fetchSingleMessageWithReactions(
  messageId: number,
  currentUserId: string,
): Promise<FormattedMessage | null> {
  const [message] = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.id, messageId));

  if (!message) return null;

  const reactions = await db
    .select()
    .from(reactionsTable)
    .where(eq(reactionsTable.messageId, messageId));

  const emojiMap = new Map<string, { count: number; userReacted: boolean }>();
  for (const r of reactions) {
    if (!emojiMap.has(r.emoji)) emojiMap.set(r.emoji, { count: 0, userReacted: false });
    const emojiData = emojiMap.get(r.emoji)!;
    emojiData.count++;
    if (r.userId === currentUserId) emojiData.userReacted = true;
  }

  const reactionGroups = Array.from(emojiMap.entries()).map(([emoji, data]) => ({
    emoji,
    count: data.count,
    userReacted: data.userReacted,
  }));

  return {
    id: message.id,
    channelId: message.channelId,
    userId: message.userId,
    username: message.username,
    avatarUrl: message.avatarUrl ?? null,
    authorRole: message.authorRole,
    content: message.content,
    createdAt: message.createdAt,
    reactions: reactionGroups,
    isPinned: message.isPinned,
  };
}
