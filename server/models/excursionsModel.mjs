import { pool } from "../db/postgresConnection.mjs";
import registrationsModel from "./registrationsModel.mjs";

const excursionsModel = {
  getExcursions: async () => {
    try {
      const excursions = await pool.query(`
      SELECT * FROM excursions
        `);
      return excursions.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  searchExcursions: async (searchQuery) => {
    try {
      const query = `
        SELECT * FROM excursions
        WHERE title ILIKE $1
        OR date_time::date = $2::date
      `;
      const excursions = await pool.query(query, [
        `%${searchQuery}%`,
        searchQuery,
      ]);
      return excursions.rows;
    } catch (error) {
      console.error("Error searching excursions:", error);
      throw error;
    }
  },

  getExcursionById: async (id) => {
    try {
      const query = "SELECT * FROM excursions WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createExcursion: async (title, image, type, duration, price) => {
    let capacity = 1; // Default individualioms ekskursijoms
    
    if (type === 'group') {
      capacity = 5; // Grupinems ekskursijoms
    }
  
    try {
      const result = await pool.query(
        "INSERT INTO excursions (title, image, type, duration, price, capacity, average_rating) VALUES ($1, $2, $3, $4, $5, $6, '0') RETURNING *",
        [title, image, type, duration, price, capacity]
      );
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteExcursion: async (id) => {
    try {
      const query = "DELETE FROM excursions WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateExcursion: async (id, updatedExcursion) => {
    try {
      // Convert ID to integer to ensure it's valid for PostgreSQL queries
      const excursionId = parseInt(id, 10);
      if (isNaN(excursionId)) {
        throw new Error("Invalid excursion ID");
      }

      // Validate the updated fields to avoid updating with empty or invalid data
      if (
        !updatedExcursion ||
        typeof updatedExcursion !== "object" ||
        Object.keys(updatedExcursion).length === 0
      ) {
        throw new Error("Invalid updated fields");
      }

      // Create the query's set fields and values
      const setFields = Object.keys(updatedExcursion)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");

      const values = [...Object.values(updatedExcursion), excursionId]; // Correct order of values

      // Execute the query with parameterized inputs
      const result = await pool.query(
        `UPDATE excursions SET ${setFields} WHERE id = $${values.length} RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        // No excursion found with the given ID
        throw new Error("Excursion not found");
      }

      return result.rows[0]; // Return the updated excursion
    } catch (error) {
      console.error("Error in updateExcursion:", error.message); // Log the error message
      throw error; // Re-throw the error to handle it elsewhere
    }
  },

  // prieinamu datu ir laiku gavimas pagal ekskursijos id (netrinti!)
  getScheduleByExcursionId: async (id) => {
    try {
      const schedule = await pool.query(
        "SELECT * FROM schedule WHERE excursion_id = $1",
        [id]
      );
      return schedule.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // schedule atnaujinimas (netrinti!)
  updateSchedule: async (id, dateTimes) => {
    try {
      // Patikriname ar yra registraciju
      const registrationsQuery =
        "SELECT COUNT(*) FROM registrations WHERE excursion_id = $1";
      const registrationsResult = await pool.query(registrationsQuery, [id]);
      const registrationsCount = parseInt(registrationsResult.rows[0].count);
      // Jei yra registracijų, netrinam
      if (registrationsCount > 0) {
        throw new Error("Cannot delete schedule because registrations exist");
      }

      // Jei registracijų nėra, ištriname senus įrašus
      await pool.query("DELETE FROM schedule WHERE excursion_id = $1", [id]);

      // Idedame naujus irasus
      const insertPromises = dateTimes.map((dateTime) =>
        pool.query(
          "INSERT INTO schedule (excursion_id, date_time) VALUES ($1, $2)",
          [id, dateTime]
        )
      );
      await Promise.all(insertPromises);

      // Gauname atnaujinta tvarkarasti
      const result = await pool.query(
        "SELECT date_time FROM schedule WHERE excursion_id = $1",
        [id]
      );
      const updatedSchedule = result.rows.map((row) => row.date_time);

      return updatedSchedule; // Graziname paprasta datu masyva
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
// atsiliepimo sukurimas, netrinti
  createReview: async (rating, comment, user_id, excursion_id) => {
    try {
      const result = await pool.query(
        "INSERT INTO ratings (rating, comment, user_id, excursion_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [rating, comment, user_id, excursion_id]
      );

      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getReviewByUserAndExcursion: async (user_id, excursion_id) => {
    try {
      const query = 'SELECT * FROM ratings WHERE user_id = $1 AND excursion_id = $2';
      const values = [user_id, excursion_id];
  
      const { rows } = await pool.query(query, values);
  
      // Grąžinti pirmą rastą atsiliepimą arba null, jei atsiliepimas nerastas
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error in getReviewByUserAndExcursion:', error.message);
      throw error;
    }
  },



  //salinam reitingus (netrinti)
  deleteRatingsByExcursionId: async (excursionId) => {
    try {
      const query = "DELETE FROM ratings WHERE excursion_id = $1";
      await pool.query(query, [excursionId]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // reitingo vidurkio gavimas
  getAverageRatingForExcursion: async (excursionId) => {
    try {
      const result = await pool.query(
        "SELECT AVG(rating) AS average_rating FROM ratings WHERE excursion_id = $1",
        [excursionId]
      );

      // Jeigu nera ivertinimu siai ekskursijai, grazinti null
      if (result.rows.length === 0 || result.rows[0].average_rating === null) {
        return null;
      }

      // Suapvalinti vidurki iki 2 skaiciu po kablelio
      const averageRating = parseFloat(result.rows[0].average_rating).toFixed(
        2
      );

      return averageRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
// netrinti
  updateAverageRating: async (excursion_id) => {
    try {
      const result = await pool.query(
        "UPDATE excursions SET average_rating = (SELECT AVG(rating) FROM ratings WHERE excursion_id = $1) WHERE id = $1 RETURNING *",
        [excursion_id]
      );

      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Ekskursijos datos ir laiko atnaujinimas
  // upsertExcursionTimeSlot: async (excursion_id, date_time) => {
  //   try {
  //     const existingSlot = await pool.query(
  //       "SELECT * FROM schedule WHERE excursion_id = $1 AND date_time = $2",
  //       [excursion_id, date_time]
  //     );

  //     if (existingSlot.rows.length > 0) {
  //       const result = await pool.query(
  //         "UPDATE schedule SET date_time = $1 WHERE excursion_id = $2 AND date_time = $3 RETURNING *",
  //         [date_time, excursion_id, existingSlot.rows[0].date_time]
  //       );
  //       return result.rows[0];
  //     } else {
  //       const result = await pool.query(
  //         "INSERT INTO schedule (excursion_id, date_time) VALUES ($1, $2) RETURNING *",
  //         [excursion_id, date_time]
  //       );
  //       return result.rows[0];
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // },

  // registracijis sukurimas , netrinti
  createRegistration: async (user_id, excursion_id, name, date_time) => {
    try {
      // Tikrinama, ar vartotojas jau užsiregistravęs šiai ekskursijai
      const isRegistered = await registrationsModel.isUserRegistered(
        user_id,
        excursion_id
      );
      if (isRegistered) {
        throw new Error("The user is already registered for this excursion");
      }

      const query = `
        INSERT INTO registrations (user_id, excursion_id, name, date_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [user_id, excursion_id, name, date_time];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error creating registration:", error);
      throw error;
    }
  },

  // vartotojo registravimas i ekskursija
  // createRegistration: async (user_id, excursion_id, name, date_time) => {
  //   try {
  //     const result = await pool.query(
  //       "INSERT INTO registrations (user_id, excursion_id, name, date_time, confirmation) VALUES ($1, $2, $3, $4, 'false') RETURNING *",
  //       [user_id, excursion_id, name, date_time]
  //     );
  //     return result.rows[0];
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // },

};

export default excursionsModel;
