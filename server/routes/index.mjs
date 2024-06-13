import express from "express";
import usersRouter from "./users.mjs";
import excursionsRouter from "./excursions.mjs";
import registrationsRouter from "./registrations.mjs";
import scheduleRouter from "./schedule.mjs";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/excursions", excursionsRouter);

router.use("/registrations", registrationsRouter);
router.use("/schedule", scheduleRouter);

export default router;
