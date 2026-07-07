import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import { requireAuth, requireVerifiedMember, requireAdmin } from "../middlewares/auth";
import { syncEvents } from "../lib/eventSync";

const router: IRouter = Router();

// GET /events
router.get("/events", requireAuth, requireVerifiedMember, async (_req, res): Promise<void> => {
  const events = await db.select().from(eventsTable).orderBy(asc(eventsTable.date));
  res.json(
    events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location ?? null,
      type: e.type,
      sourceUrl: e.sourceUrl ?? null,
    })),
  );
});

// POST /events/sync — scrape VectorVest EU events and refresh the DB
router.post("/events/sync", requireAuth, requireVerifiedMember, requireAdmin, async (_req, res): Promise<void> => {
  try {
    const synced = await syncEvents();
    res.json({ synced });
  } catch (err) {
    console.error("Events sync failed", err);
    res.status(502).json({ error: (err as Error).message || "Could not sync events from VectorVest website" });
  }
});

export default router;
