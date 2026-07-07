import { Router, type IRouter } from "express";
import { db, coursesTable } from "@workspace/db";
import { requireAuth, requireVerifiedMember } from "../middlewares/auth";

const router: IRouter = Router();

// GET /university/courses
router.get("/university/courses", requireAuth, requireVerifiedMember, async (_req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable);
  res.json(
    courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      instructor: c.instructor,
      duration: c.duration ?? null,
      level: c.level,
      videoUrl: c.videoUrl ?? null,
      thumbnailUrl: c.thumbnailUrl ?? null,
      isLocked: c.isLocked,
    })),
  );
});

export default router;
