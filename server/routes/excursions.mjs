import express from "express";
import dotenv from "dotenv";
import excursionsController from "../controller/excursionsController.mjs";
import { validate } from "../middleware/schemaValidator.mjs";
import { excursionValidationSchema } from "../validators/excursionValidator.mjs";

dotenv.config();

const router = express.Router();

// visu ekskursiju gavimas
router.get("/", excursionsController.getExcursions);

// vienos ekskursijos pagal id gavimas
router.get("/:id", excursionsController.getExcursionById);

// ekskursijos istrynimas
router.delete("/:id", excursionsController.deleteExcursion);

// ekskursijos sukurimas
router.post(
  "/",
  validate(excursionValidationSchema),
  excursionsController.createExcursion
);

// ekskursijos redagavimas
router.patch(
  "/:id",
  validate(excursionValidationSchema),
  excursionsController.updateExcursion
);

// atsiliepimo sukurimas
router.post("/:id/addreview", excursionsController.createReview);

// vidurkio gavimas
router.get(
  "/:id/average-rating",
  excursionsController.getAverageRatingForExcursion
);

// ekskursijos schedule gavimas
router.get("/:id/schedule", excursionsController.getExcursionSchedule);

router.patch(
  "/:id/updateTimeSlot",
  excursionsController.updateExcursionTimeSlot
);

// registracijos sukurimas
router.post("/:id/register", excursionsController.createRegistration);

router.get(
  "/:id/registrationStatus",
  excursionsController.getRegistrationStatusForUser
);

export default router;
