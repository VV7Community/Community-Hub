import { eq } from "drizzle-orm";
import { createClerkClient } from "@clerk/express";
import { db, usersTable, type User } from "@workspace/db";
import { membershipVerifier, recordMembershipAudit, isBootstrapAdminEmail } from "./membership";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Loads (or JIT-provisions) the app-local user row for a Clerk user, and runs
 * membership verification the first time the row is created. Shared by every
 * route that needs the current user's profile so provisioning + verification
 * stay in one place.
 */
export async function getOrCreateUser(userId: string): Promise<User | undefined> {
  let [user] = await db.select().from(usersTable).where(eq(usersTable.userId, userId));

  if (user) {
    // Covers the case where BOOTSTRAP_ADMIN_EMAIL is set after the account
    // already exists (e.g. someone signed up before an admin was bootstrapped).
    if (isBootstrapAdminEmail(user.email) && (user.role !== "admin" || user.membershipStatus !== "verified")) {
      const [promoted] = await db
        .update(usersTable)
        .set({
          role: "admin",
          membershipStatus: "verified",
          membershipMethod: "manual",
          membershipVerifiedAt: new Date(),
        })
        .where(eq(usersTable.userId, userId))
        .returning();
      await recordMembershipAudit({ targetUserId: userId, action: "bootstrap_admin" });
      return promoted ?? user;
    }
    return user;
  }

  let username = `user_${userId.slice(-6)}`;
  let avatarUrl: string | null = null;
  let email: string | null = null;

  try {
    const clerkUser = await clerk.users.getUser(userId);
    username =
      clerkUser.username ||
      `${clerkUser.firstName ?? ""}${clerkUser.lastName ?? ""}`.trim() ||
      username;
    avatarUrl = clerkUser.imageUrl ?? null;
    email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null;
  } catch {
    // Clerk lookup failed — fall back to placeholder profile, membership stays pending
  }

  const isBootstrapAdmin = isBootstrapAdminEmail(email);
  const verification = isBootstrapAdmin
    ? ({ status: "verified", vectorVestMemberId: null } as const)
    : await membershipVerifier.verify({ email, userId });

  const [created] = await db
    .insert(usersTable)
    .values({
      userId,
      username,
      email,
      avatarUrl,
      role: isBootstrapAdmin ? "admin" : "member",
      membershipStatus: verification.status,
      membershipVerifiedAt: verification.status === "verified" ? new Date() : null,
      membershipMethod: verification.status === "verified" ? "manual" : null,
    })
    .onConflictDoNothing()
    .returning();

  if (!created) {
    // Race: another request created the row concurrently
    [user] = await db.select().from(usersTable).where(eq(usersTable.userId, userId));
    return user;
  }

  if (isBootstrapAdmin) {
    await recordMembershipAudit({ targetUserId: userId, action: "bootstrap_admin" });
  } else if (verification.status === "verified") {
    await recordMembershipAudit({ targetUserId: userId, action: "auto_verified" });
  }

  return created;
}
