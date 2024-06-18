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

  // getRegistrationsDetails: async (req, res) => {
  //   try {
  //     const registrations =
  //       await registrationsModel.getRegistrationsWithReviewInfo();
  //     res.status(200).json(registrations);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // },





  checkRegistrationStatus: async (req, res) => {
    const { userId, excursionId } = req.body;
  
    try {
      // Проверяем, зарегистрирован ли пользователь на данную экскурсию
      const alreadyRegistered = await isUserRegistered(userId, excursionId);
  
      if (alreadyRegistered) {
        return res.status(400).json({ message: 'Вы уже зарегистрированы на эту экскурсию.' });
      }
  
      // Создаем новую регистрацию
      const newRegistration = await createRegistration(userId, excursionId);
      
      return res.status(201).json(newRegistration);
    } catch (error) {
      console.error('Ошибка при регистрации пользователя на экскурсию:', error);
      return res.status(500).json({ message: 'Ошибка сервера, попробуйте позже.' });
    }
  },
};

export default registrationsController;
