import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { UpdateMeBody } from "@workspace/api-zod";
import { requireAuth, type AuthedRequest } from "../middlewares/auth";
import { getOnlineCount, getOnlineUsersList } from "../ws";
import { getOrCreateUser } from "../lib/userProvisioning";

const router: IRouter = Router();

// GET /users/me
router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as AuthedRequest).userId;
  try {
    const user = await getOrCreateUser(userId);
    if (!user) {
      res.status(500).json({ error: "Could not load profile" });
      return;
    }
    res.json({
      userId: user.userId,
      username: user.username,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role,
      membershipStatus: user.membershipStatus,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /users/me
router.put("/users/me", requireAuth, async (req, res): Promise<void> => {
  const body = UpdateMeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const userId = (req as AuthedRequest).userId;

  try {
    const [updated] = await db
      .update(usersTable)
      .set({ username: body.data.username, updatedAt: new Date() })
      .where(eq(usersTable.userId, userId))
      .returning();

    if (!updated) {
      // User doesn't exist yet — create first
      await getOrCreateUser(userId);
      const [retry] = await db
        .update(usersTable)
        .set({ username: body.data.username, updatedAt: new Date() })
        .where(eq(usersTable.userId, userId))
        .returning();
      if (!retry) {
        res.status(500).json({ error: "Could not update profile" });
        return;
      }
      res.json({
        userId: retry.userId,
        username: retry.username,
        avatarUrl: retry.avatarUrl ?? null,
        role: retry.role,
        membershipStatus: retry.membershipStatus,
      });
      return;
    }

    res.json({
      userId: updated.userId,
      username: updated.username,
      avatarUrl: updated.avatarUrl ?? null,
      role: updated.role,
      membershipStatus: updated.membershipStatus,
    });
  } catch (err) {
    req.log.error({ err }, "Error updating user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users/online
router.get("/users/online", requireAuth, async (_req, res): Promise<void> => {
  const users = getOnlineUsersList();
  res.json({ count: users.length, users });
});

export default router;
