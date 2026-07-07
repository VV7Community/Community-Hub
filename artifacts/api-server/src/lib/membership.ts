import { eq } from "drizzle-orm";
import { db, vectorvestAllowlistTable, membershipAuditLogTable } from "@workspace/db";

export type MembershipVerification =
  | { status: "verified"; vectorVestMemberId: string | null }
  | { status: "pending" }
  | { status: "rejected"; reason: string };

export interface MembershipVerifier {
  verify(input: { email: string | null; userId: string }): Promise<MembershipVerification>;
}

/**
 * Temporary verification strategy until VectorVest provides an SSO/API
 * integration: an admin-curated allowlist of member emails. Swap for
 * StubApiVerifier (or drop entirely in favor of SSO claims) once that
 * integration exists — callers only depend on the MembershipVerifier interface.
 */
export class ManualAllowlistVerifier implements MembershipVerifier {
  async verify(input: { email: string | null; userId: string }): Promise<MembershipVerification> {
    if (!input.email) return { status: "pending" };
    const [entry] = await db
      .select()
      .from(vectorvestAllowlistTable)
      .where(eq(vectorvestAllowlistTable.email, input.email.toLowerCase()));
    if (!entry) return { status: "pending" };
    return { status: "verified", vectorVestMemberId: entry.vectorVestMemberId ?? null };
  }
}

/**
 * Skeleton for a future call to a VectorVest member API. Not wired up yet —
 * fill in once VectorVest shares API credentials/spec.
 */
export class StubApiVerifier implements MembershipVerifier {
  async verify(_input: { email: string | null; userId: string }): Promise<MembershipVerification> {
    throw new Error("StubApiVerifier is not implemented yet — VectorVest API access is pending.");
  }
}

export const membershipVerifier: MembershipVerifier = new ManualAllowlistVerifier();

export async function recordMembershipAudit(entry: {
  targetUserId: string;
  actorUserId?: string | null;
  action: "auto_verified" | "manual_verified" | "manual_rejected" | "reset_to_pending";
  reason?: string | null;
}): Promise<void> {
  await db.insert(membershipAuditLogTable).values({
    targetUserId: entry.targetUserId,
    actorUserId: entry.actorUserId ?? null,
    action: entry.action,
    reason: entry.reason ?? null,
  });
}
