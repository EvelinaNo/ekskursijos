import express from "express";
import scheduleController from "../controller/scheduleController.mjs";

const router = express.Router();

router.get("/:id", scheduleController.getExcursionSchedule);
// Naujos datos ir laiko ekskursijai pridejimas
router.post("/:id/addTimeSlot", scheduleController.addExcursionTimeSlot);
// router.put('/:id/updateTimeSlot/:timeSlotId', scheduleController.updateExcursionTimeSlot);
router.delete(
  "/:id/deleteTimeSlot/:timeSlotId",
  scheduleController.deleteExcursionTimeSlot
);

export default router;
