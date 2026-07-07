import { Router, type IRouter } from "express";
import healthRouter from "./health";
import channelsRouter from "./channels";
import messagesRouter from "./messages";
import usersRouter from "./users";
import webinarsRouter from "./webinars";
import eventsRouter from "./events";
import universityRouter from "./university";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(channelsRouter);
router.use(messagesRouter);
router.use(usersRouter);
router.use(webinarsRouter);
router.use(eventsRouter);
router.use(universityRouter);
router.use(adminRouter);

export default router;
