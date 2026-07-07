import { pgTable, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { messagesTable } from "./messages";

export const messageTranslationsTable = pgTable(
  "message_translations",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    messageId: integer("message_id")
      .notNull()
      .references(() => messagesTable.id, { onDelete: "cascade" }),
    language: text("language").notNull(), // e.g. "fr"
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("message_lang_unique").on(t.messageId, t.language)],
);

export const insertMessageTranslationSchema = createInsertSchema(messageTranslationsTable).omit({
  createdAt: true,
});
export type InsertMessageTranslation = z.infer<typeof insertMessageTranslationSchema>;
export type MessageTranslation = typeof messageTranslationsTable.$inferSelect;
