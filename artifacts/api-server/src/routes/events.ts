import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// GET /events
router.get("/events", requireAuth, async (_req, res): Promise<void> => {
  const events = await db.select().from(eventsTable).orderBy(asc(eventsTable.date));
  res.json(
    events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location ?? null,
      type: e.type,
    })),
  );
});

export default router;
