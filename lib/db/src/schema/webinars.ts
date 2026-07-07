import { pgTable, text, serial, timestamp, integer, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const webinarsTable = pgTable(
  "webinars",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    hostName: text("host_name").notNull(),
    hostUserId: text("host_user_id").references(() => usersTable.userId),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    status: text("status").notNull().default("upcoming"), // upcoming | live | past
    thumbnailUrl: text("thumbnail_url"),
    sessionNumber: integer("session_number"),
    roomName: text("room_name").unique(),
    recordingStatus: text("recording_status").notNull().default("none"), // none | recording | processing | ready | failed
    recordingUrl: text("recording_url"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (t) => [
    check("webinars_status_check", sql`${t.status} IN ('upcoming', 'live', 'past')`),
    check(
      "webinars_recording_status_check",
      sql`${t.recordingStatus} IN ('none', 'recording', 'processing', 'ready', 'failed')`,
    ),
  ],
);

export const insertWebinarSchema = createInsertSchema(webinarsTable).omit({ id: true });
export type InsertWebinar = z.infer<typeof insertWebinarSchema>;
export type Webinar = typeof webinarsTable.$inferSelect;
