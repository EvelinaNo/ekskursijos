import { pool } from "../db/postgresConnection.mjs";

const registrationsModel = {
  //netrinti
  getAllRegistrations: async () => {
    try {
      const query = `
        SELECT r.id AS registration_id, e.title AS excursion_title, e.duration, e.type, e.price, e.image, e.average_rating, 
               r.confirmation, r.name, r.date_time
        FROM registrations r
        JOIN excursions e ON r.excursion_id = e.id;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Failed to get all registrations:", error);
      throw error;
    }
  },

  getUserRegistrations: async (userId) => {
    const query = "SELECT excursion_id FROM registrations WHERE user_id = $1";
    const values = [userId];

    const { rows } = await pool.query(query, values);
    return rows.map((row) => row.excursion_id);
  },

  confirmRegistration: async (registrationId) => {
    try {
      const query = `
        UPDATE registrations 
        SET confirmation = true 
        WHERE id = $1
      `;
      await pool.query(query, [registrationId]);
    } catch (error) {
      console.error("Failed to confirm registration:", error);
      throw error;
    }
  },

  // patikrinti, ar sukurta registracija , netrinti
  isUserRegistered: async (userId, excursionId) => {
    try {
      const query =
        "SELECT * FROM registrations WHERE user_id = $1 AND excursion_id = $2";
      const values = [userId, excursionId];

      const { rows } = await pool.query(query, values);
      return rows.length > 0;
    } catch (error) {
      console.error("Error in isUserRegistered:", error.message);
      throw error;
    }
  },

  getRegistrationById: async (id) => {
    try {
      const result = await pool.query(
        "SELECT * FROM registrations WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateRegistration: async (id, updatedRegistration) => {
    try {
      const setFields = Object.keys(updatedRegistration)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");
      const values = Object.values(updatedRegistration);
      const query = `UPDATE registrations SET ${setFields} WHERE id = $${
        values.length + 1
      } RETURNING *`;
      const result = await pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  // netrinti, bandau
  updateRegistrationDateTime: async ( date_time, registration_id) => {
    try {
      const query = `
        UPDATE registrations
        SET date_time = $1
        WHERE id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [date_time, registration_id]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteRegistration: async (excursionId) => {
    try {
      const result = await pool.query(
        "DELETE FROM registrations WHERE excursion_id = $1 RETURNING *",
        [excursionId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  // netrinti
  getRegistrationsCount: async (excursionId) => {
    try {
      const query =
        "SELECT COUNT(*) FROM registrations WHERE excursion_id = $1";
      const result = await pool.query(query, [excursionId]);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error("Error in getRegistrationsCount:", error);
      throw error;
    }
  },
};

export default registrationsModel;
