import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, webinarsTable } from "@workspace/db";
import { requireAuth, requireVerifiedMember } from "../middlewares/auth";

const router: IRouter = Router();

// GET /webinars
router.get("/webinars", requireAuth, requireVerifiedMember, async (_req, res): Promise<void> => {
  const webinars = await db
    .select()
    .from(webinarsTable)
    .orderBy(desc(webinarsTable.scheduledAt));

  res.json(
    webinars.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      hostName: w.hostName,
      scheduledAt: w.scheduledAt,
      status: w.status,
      thumbnailUrl: w.thumbnailUrl ?? null,
      sessionNumber: w.sessionNumber ?? null,
    })),
  );
});

export default router;
