import registrationsModel from "../models/registrationsModel.mjs";
import Registrations from "../models/registrationsModel.mjs";

const registrationsController = {

  getRegistrations: async (req, res) => {
    try {
      const registrations = await Registrations.getRegistrations();
      res.status(200).json(registrations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllRegistrations: async (req, res) => {
    try {
      const registrations = await registrationsModel.getAllRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Failed to get excursions:", error);
      res
        .status(500)
        .json({ message: "An error occurred while getting excursions" });
    }
  },

  confirmRegistration: async (req, res) => {
    const { registrationId } = req.params;
    try {
      await registrationsModel.confirmRegistration(registrationId);
      res.status(200).json({ message: "Registration confirmed" });
    } catch (error) {
      console.error("Failed to confirm registration:", error);
      res
        .status(500)
        .json({ message: "An error occurred while confirming registration" });
    }
  },

  getRegistrationsDetails: async (req, res) => {
    try {
      const registrations =
        await registrationsModel.getRegistrationsWithReviewInfo();
      res.status(200).json(registrations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default registrationsController;
