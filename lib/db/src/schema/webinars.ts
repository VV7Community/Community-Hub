import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const webinarsTable = pgTable("webinars", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hostName: text("host_name").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming | live | past
  thumbnailUrl: text("thumbnail_url"),
  sessionNumber: integer("session_number"),
});

export const insertWebinarSchema = createInsertSchema(webinarsTable).omit({ id: true });
export type InsertWebinar = z.infer<typeof insertWebinarSchema>;
export type Webinar = typeof webinarsTable.$inferSelect;
