import { Router, type IRouter } from "express";
import channelsRouter from "./channels";
import messagesRouter from "./messages";
import usersRouter from "./users";
import webinarsRouter from "./webinars";
import eventsRouter from "./events";
import universityRouter from "./university";
import adminRouter from "./admin";
import translateRouter from "./translate";

const router: IRouter = Router();

router.use(channelsRouter);
router.use(messagesRouter);
router.use(usersRouter);
router.use(webinarsRouter);
router.use(eventsRouter);
router.use(universityRouter);
router.use(adminRouter);
router.use(translateRouter);

export default router;
