import express from "express";
import dotenv from "dotenv";
import registrationsController from "../controller/registrationsController.mjs";

dotenv.config();

const router = express.Router();

router.get("/admin/excursions", registrationsController.getAllRegistrations);

router.put(
  "/admin/confirm/:registrationId",
  registrationsController.confirmRegistration
);

router.get("/", registrationsController.getRegistrationsDetails);

router.get("/", registrationsController.getRegistrations);




export default router;
