import express from "express";
import dotenv from "dotenv";
import registrationsController from "../controller/registrationsController.mjs";
import excursionsController from "../controller/excursionsController.mjs";

dotenv.config();

const router = express.Router();
// netrinti
router.get("/admin/excursions", registrationsController.getAllRegistrations);
// netrinti
router.put(
  "/admin/confirm/:registrationId",
  registrationsController.confirmRegistration
);

// router.get("/", registrationsController.getRegistrationsDetails);

export default router;
