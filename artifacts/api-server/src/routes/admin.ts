import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, vectorvestAllowlistTable } from "@workspace/db";
import {
  VerifyMemberBody,
  RejectMemberBody,
  AddAllowlistEntryBody,
} from "@workspace/api-zod";
import { requireAuth, requireAdmin, type AuthedRequest } from "../middlewares/auth";
import { recordMembershipAudit } from "../lib/membership";

const router: IRouter = Router();

router.use("/admin", requireAuth, requireAdmin);

function toMemberSummary(u: typeof usersTable.$inferSelect) {
  return {
    userId: u.userId,
    username: u.username,
    email: u.email ?? null,
    avatarUrl: u.avatarUrl ?? null,
    role: u.role,
    membershipStatus: u.membershipStatus,
    membershipMethod: u.membershipMethod ?? null,
    membershipVerifiedAt: u.membershipVerifiedAt ? u.membershipVerifiedAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  };
}

// GET /admin/members?status=pending
router.get("/admin/members", async (req, res): Promise<void> => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const members = status
    ? await db.select().from(usersTable).where(eq(usersTable.membershipStatus, status))
    : await db.select().from(usersTable);
  res.json(members.map(toMemberSummary));
});

// POST /admin/members/:userId/verify
router.post("/admin/members/:userId/verify", async (req, res): Promise<void> => {
  const body = VerifyMemberBody.safeParse(req.body ?? {});
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const targetUserId = req.params.userId;
  const [updated] = await db
    .update(usersTable)
    .set({
      membershipStatus: "verified",
      membershipMethod: "manual",
      membershipVerifiedAt: new Date(),
    })
    .where(eq(usersTable.userId, targetUserId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  await recordMembershipAudit({
    targetUserId,
    actorUserId: (req as unknown as AuthedRequest).userId,
    action: "manual_verified",
  });

  res.json(toMemberSummary(updated));
});

// POST /admin/members/:userId/reject
router.post("/admin/members/:userId/reject", async (req, res): Promise<void> => {
  const body = RejectMemberBody.safeParse(req.body ?? {});
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const targetUserId = req.params.userId;
  const [updated] = await db
    .update(usersTable)
    .set({ membershipStatus: "rejected" })
    .where(eq(usersTable.userId, targetUserId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  await recordMembershipAudit({
    targetUserId,
    actorUserId: (req as unknown as AuthedRequest).userId,
    action: "manual_rejected",
    reason: body.data.reason ?? null,
  });

  res.json(toMemberSummary(updated));
});

// GET /admin/allowlist
router.get("/admin/allowlist", async (_req, res): Promise<void> => {
  const entries = await db.select().from(vectorvestAllowlistTable);
  res.json(
    entries.map((e) => ({
      id: e.id,
      email: e.email,
      vectorVestMemberId: e.vectorVestMemberId ?? null,
      addedBy: e.addedBy,
      addedAt: e.addedAt.toISOString(),
      notes: e.notes ?? null,
    })),
  );
});

// POST /admin/allowlist
router.post("/admin/allowlist", async (req, res): Promise<void> => {
  const body = AddAllowlistEntryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [created] = await db
    .insert(vectorvestAllowlistTable)
    .values({
      email: body.data.email.toLowerCase(),
      vectorVestMemberId: body.data.vectorVestMemberId ?? null,
      notes: body.data.notes ?? null,
      addedBy: (req as unknown as AuthedRequest).userId,
    })
    .onConflictDoNothing()
    .returning();

  if (!created) {
    res.status(409).json({ error: "Email already on the allowlist" });
    return;
  }

  res.status(201).json({
    id: created.id,
    email: created.email,
    vectorVestMemberId: created.vectorVestMemberId ?? null,
    addedBy: created.addedBy,
    addedAt: created.addedAt.toISOString(),
    notes: created.notes ?? null,
  });
});

// DELETE /admin/allowlist/:id
router.delete("/admin/allowlist/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(vectorvestAllowlistTable)
    .where(eq(vectorvestAllowlistTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.status(204).send();
});

export default router;
