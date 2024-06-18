import express from "express";
import dotenv from "dotenv";
import excursionsController from "../controller/excursionsController.mjs";
import { validate } from "../middleware/schemaValidator.mjs";
import { excursionValidationSchema } from "../validators/excursionValidator.mjs";
import scheduleModel from "../models/scheduleModel.mjs";
import registrationsController from "../controller/registrationsController.mjs";
import excursionsModel from "../models/excursionsModel.mjs";
import registrationsModel from "../models/registrationsModel.mjs";

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

// ekskursijos schedule gavimas (netrinti!)
router.get("/:id/schedule", excursionsController.getExcursionSchedule);

// ekskursijos schedule atnaujinimas (netrinti!)
router.patch("/:id/schedule", excursionsController.updateExcursionSchedule);

// registracijos i ekskursija sukurimas
router.post("/:id/register", excursionsController.createRegistration);

// patikrinti, ar uzregistruotas
router.get(
  "/registrationStatus",
  registrationsController.checkRegistrationStatus
);

//netrinti, bandau
router.patch(
  "/:id/register-edit/:registrationId",
  excursionsController.updateRegistrationDateTime
);

export default router;
