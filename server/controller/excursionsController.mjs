import excursionsModel from "../models/excursionsModel.mjs";
// import ratingsModel from "../models/ratingsModel.mjs";
import registrationsModel from "../models/registrationsModel.mjs";
import scheduleModel from "../models/scheduleModel.mjs";

const excursionsController = {
  // Visu ekskursiju gavimas
  getExcursions: async (req, res) => {
    try {
      const excursions = await excursionsModel.getExcursions(req.query);
      // iskonsoliname, kad paziureti kokias ekskursijas gavome
      console.log("Excursions data:", excursions);
      res.status(200).json(excursions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getExcursionsWithRegistrations: async (req, res) => {
    const { userId } = req.query;

    try {
      const excursions = await getExcursions();
      const userRegistrations = await getUserRegistrations(userId);

      res.json({ excursions, userRegistrations });
    } catch (error) {
      console.error("Ошибка при получении экскурсий:", error);
      res.status(500).json({ message: "Ошибка сервера, попробуйте позже." });
    }
  },

  // ekskursiju paieska
  searchExcursions: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      const excursions = await excursionsModel.searchExcursions(searchQuery);
      res.status(200).json(excursions);
    } catch (error) {
      console.error("Error searching excursions:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // naujos ekskursijos sukurimas
  createExcursion: async (req, res) => {
    try {
      const { title, image, type, duration, price, capacity } = req.body;
      const newExcursion = await excursionsModel.createExcursion(
        title,
        image,
        type,
        duration,
        price,
        capacity
      );

      res.status(201).json(newExcursion);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the excursion" });
    }
  },

  // Info gavimas apie konkrecia ekskursija pagal id
  getExcursionById: async (req, res) => {
    try {
      const excursionId = req.params.id;
      const excursion = await excursionsModel.getExcursionById(excursionId);
      if (!excursion) {
        return res.status(404).json({ message: "Excursion not found" });
      }
      res.status(200).json(excursion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // info atnaujinimas apie konkrecia ekskursija pagal id
  updateExcursion: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedExcursion = req.body;
      const excursion = await excursionsModel.updateExcursion(
        id,
        updatedExcursion
      );
      if (!excursion) {
        res.status(404).json({ message: "Excursion not found" });
        return;
      }

      res.status(200).json(excursion);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while updating the excursion" });
    }
  },

  // Ekskursijos pasalinimas pagal id
  deleteExcursion: async (req, res) => {
    try {
      const id = req.params.id;

      // Is pradziu trinam reitingus, tvarkarasti, registracijas
      await excursionsModel.deleteRatingsByExcursionId(id);
      await scheduleModel.deleteExcursionTimeSlot(id);
      await registrationsModel.deleteRegistration(id);

      // Tada trinam pacia ekskursija

      const deletedExcursion = await excursionsModel.deleteExcursion(id);
      if (!deletedExcursion) {
        return res.status(404).json({ message: "Excursion not found" });
      }
      res
        .status(200)
        .json({ message: "Excursion deleted successfully", deletedExcursion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // atsliepimo sukurimas, netrinti
  createReview: async (req, res) => {
    try {
      const { rating, comment, user_id, excursion_id } = req.body;

      // Tikriname, ar vartotojas uzsiregistraves ekskursijai
      const userRegistered = await registrationsModel.isUserRegistered(
        user_id,
        excursion_id
      );
      if (!userRegistered) {
        return res
          .status(403)
          .json({ message: "User is not registered for this excursion" });
      }

      // Tikriname, ar vartotojas dar nepaliko atsiliepimo
      const existingReview = await excursionsModel.getReviewByUserAndExcursion(
        user_id,
        excursion_id
      );
      if (existingReview) {
        return res.status(403).json({
          message: "User has already left a review for this excursion",
        });
      }

      // Sukuriame atsiliepima ir susiejame ji su ekskursija
      const newRating = await excursionsModel.createReview(
        rating,
        comment,
        user_id,
        excursion_id
      );

      // Atnaujiname vidurki
      await excursionsModel.updateAverageRating(excursion_id);

      res.status(201).json(newRating);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the review" });
    }
  },

  // Vidurkio gavimas konkreciai ekskursijai
  getAverageRatingForExcursion: async (req, res) => {
    try {
      const excursionId = req.params.excursionId;
      const averageRating = await excursionsModel.getAverageRatingForExcursion(
        excursionId
      );

      if (averageRating === null) {
        res.status(404).json({ message: "No ratings for this excursion yet" });
        return;
      }

      res.status(200).json({ average_rating: averageRating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Vidurkio atnaujinimas konkreciai ekskursijai
  // updateAverageRatingForExcursion: async (req, res) => {
  //   try {
  //     const excursionId = req.params.excursionId;

  //     const updatedExcursion =
  //       await ratingsModel.updateAverageRatingForExcursion(excursionId);

  //     res.status(200).json(updatedExcursion);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // },

  // Ekskursiju datu ir laiku gavimas (netrinti!)
  getExcursionSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await excursionsModel.getScheduleByExcursionId(id);
      res.status(200).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Ekskursijos datos ir laiko atnaujinimas (netrinti!)
  updateExcursionSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { date_times } = req.body;

      const updatedTimeSlots = await excursionsModel.updateSchedule(
        id,
        date_times
      );

      res.status(200).json(updatedTimeSlots);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating time slots" });
    }
  },

  // Registracijos i ekskursija sukurimas, netrinti
  createRegistration: async (req, res) => {
    try {
      const { user_id, excursion_id, name, date_time } = req.body;

      // Gauname informaciją apie ekskursiją
      const excursion = await excursionsModel.getExcursionById(excursion_id);
      if (!excursion) {
        return res.status(404).json({ message: "Excursion not found" });
      }

      // Tikrinama, ar neviršytas maksimalus dalyvių skaičius
      const registrationsCount = await registrationsModel.getRegistrationsCount(
        excursion_id
      );
      if (registrationsCount >= excursion.capacity) {
        return res.status(403).json({
          message:
            "The maximum number of participants on the excursion has been reached",
        });
      }

      // sukuriame registracija
      const newRegistration = await excursionsModel.createRegistration(
        user_id,
        excursion_id,
        name,
        date_time
      );
      res.status(201).json(newRegistration);
    } catch (error) {
      console.error(error);
      if (
        error.message === "The user is already registered for this excursion"
      ) {
        res.status(400).json({
          message: "The user is already registered for this excursion",
        });
      } else {
        res.status(500).json({ message: "Error creating registration" });
      }
    }
  },

  // netrinti, bandau
  updateRegistrationDateTime: async (req, res) => {
    const { date_time } = req.body;
    const { registration_id } = req.params;

    try {
      const updatedRegistration =
        await registrationsModel.updateRegistrationDateTime(
          date_time,
          registration_id
        );

      if (!updatedRegistration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      res.json(updatedRegistration);
    } catch (error) {
      console.error("Error updating registration date:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },
};
export default excursionsController;
