import { pgTable, text, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable(
  "users",
  {
    userId: text("user_id").primaryKey(), // Clerk user ID
    username: text("username").notNull(),
    email: text("email"),
    avatarUrl: text("avatar_url"),
    role: text("role").notNull().default("member"),
    membershipStatus: text("membership_status").notNull().default("pending"),
    membershipVerifiedAt: timestamp("membership_verified_at", { withTimezone: true }),
    membershipMethod: text("membership_method"), // manual | api | sso
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [
    check("users_role_check", sql`${t.role} IN ('admin', 'member')`),
    check(
      "users_membership_status_check",
      sql`${t.membershipStatus} IN ('pending', 'verified', 'rejected')`,
    ),
  ],
);

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
