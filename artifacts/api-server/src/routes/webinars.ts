import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, webinarsTable } from "@workspace/db";
import { requireAuth, requireVerifiedMember, requireAdmin, type AuthedRequest } from "../middlewares/auth";

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
      roomName: w.roomName ?? null,
      recordingUrl: w.recordingUrl ?? null,
      recordingStatus: w.recordingStatus,
    })),
  );
});

// PATCH /webinars/:id — admin only: update status, recordingUrl
router.patch("/webinars/:id", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { status, recordingUrl, recordingStatus } = req.body as {
    status?: "upcoming" | "live" | "past";
    recordingUrl?: string;
    recordingStatus?: "none" | "recording" | "processing" | "ready" | "failed";
  };

  const validStatuses = ["upcoming", "live", "past"];
  const validRecordingStatuses = ["none", "recording", "processing", "ready", "failed"];

  if (status && !validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  if (recordingStatus && !validRecordingStatuses.includes(recordingStatus)) {
    res.status(400).json({ error: "Invalid recordingStatus" });
    return;
  }

  const updates: Partial<typeof webinarsTable.$inferInsert> = {};
  if (status) updates.status = status;
  if (recordingUrl !== undefined) updates.recordingUrl = recordingUrl;
  if (recordingStatus) updates.recordingStatus = recordingStatus;
  if (status === "live") updates.startedAt = new Date();
  if (status === "past") updates.endedAt = new Date();

  const [updated] = await db
    .update(webinarsTable)
    .set(updates)
    .where(eq(webinarsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Webinar not found" });
    return;
  }

  res.json({
    id: updated.id,
    title: updated.title,
    status: updated.status,
    recordingUrl: updated.recordingUrl ?? null,
    recordingStatus: updated.recordingStatus,
    roomName: updated.roomName ?? null,
  });
});

export default router;
