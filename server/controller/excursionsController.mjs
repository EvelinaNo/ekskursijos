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
      const { title, image, type, duration, price } = req.body;
      const newExcursion = await excursionsModel.createExcursion(
        title,
        image,
        type,
        duration,
        price
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
      const excursionId = req.params.id;

      // Is pradziu trinam reitingus, tvarkarasti, registracijas
      await excursionsController.deleteRatingsByExcursionId(excursionId);
      await scheduleModel.deleteExcursionTimeSlot(excursionId);
      await registrationsModel.deleteRegistration(excursionId);

      // Tada trinam pacia ekskursija

      const deletedExcursion = await excursionsModel.deleteExcursion(
        excursionId
      );
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

// atsliepimo sukurimas
  createReview: async (req, res) => {
    try {
      const { rating, comment, user_id, excursion_id } = req.body;

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
  updateAverageRatingForExcursion: async (req, res) => {
    try {
      const excursionId = req.params.excursionId;

      const updatedExcursion =
        await ratingnModel.updateAverageRatingForExcursion(excursionId);

      res.status(200).json(updatedExcursion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Ekskursiju datu ir laiku gavimas
  getExcursionSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await excursionsModel.getExcursionSchedule(id);
      res.status(200).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Ekskursijos datos ir laiko atnaujinimas
  updateExcursionTimeSlot: async (req, res) => {
    try {
      const { id } = req.params;
      const { date_times } = req.body; // Tarkime, kad tai masyvas

      const updatedTimeSlots = [];
      for (const date_time of date_times) {
        const updatedTimeSlot = await excursionsModel.upsertExcursionTimeSlot(
          id,
          date_time
        );
        updatedTimeSlots.push(updatedTimeSlot);
      }

      res.status(200).json(updatedTimeSlots);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating time slots" });
    }
  },

  // Registracijos i ekskursija sukurimas
  createRegistration: async (req, res) => {
    try {
      const { user_id, excursion_id, name, date_time } = req.body;
      const newRegistration = await excursionsModel.createRegistration(
        user_id,
        excursion_id,
        name,
        date_time
      );
      res.status(201).json(newRegistration);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the registration" });
    }
  },

  getRegistrationStatusForUser: async (req, res) => {
    const userId = req.user.id; // Gauname dabartinį vartotojo ID (darant prielaidą, kad vartotojas yra autentifikuotas)
    const excursionId = req.params.excursionId;

    try {
      // Tikriname, ar vartotojas užsiregistravęs ekskursijai
      const registration = await registrationsModel.getRegistrationStatusForUser(
        userId,
        excursionId
      );

      if (registration) {
        // Jei registracija rasta, vadinasi, vartotojas jau užsiregistravęs
        res.status(200).json({ registered: true });
      } else {
        // Jei registracija nerasta, vartotojas neregistruojamas
        res.status(200).json({ registered: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default excursionsController;
