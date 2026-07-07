import { pgTable, text, serial, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const vectorvestAllowlistTable = pgTable("vectorvest_allowlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  vectorVestMemberId: text("vectorvest_member_id"),
  addedBy: text("added_by").notNull().references(() => usersTable.userId),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  notes: text("notes"),
});

export const insertVectorvestAllowlistSchema = createInsertSchema(vectorvestAllowlistTable).omit({
  id: true,
  addedAt: true,
});
export type InsertVectorvestAllowlist = z.infer<typeof insertVectorvestAllowlistSchema>;
export type VectorvestAllowlist = typeof vectorvestAllowlistTable.$inferSelect;

export const membershipAuditLogTable = pgTable(
  "membership_audit_log",
  {
    id: serial("id").primaryKey(),
    targetUserId: text("target_user_id").notNull().references(() => usersTable.userId),
    actorUserId: text("actor_user_id").references(() => usersTable.userId),
    action: text("action").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check(
      "membership_audit_log_action_check",
      sql`${t.action} IN ('auto_verified', 'manual_verified', 'manual_rejected', 'reset_to_pending', 'bootstrap_admin')`,
    ),
  ],
);

export const insertMembershipAuditLogSchema = createInsertSchema(membershipAuditLogTable).omit({
  id: true,
  createdAt: true,
});
export type InsertMembershipAuditLog = z.infer<typeof insertMembershipAuditLogSchema>;
export type MembershipAuditLog = typeof membershipAuditLogTable.$inferSelect;
