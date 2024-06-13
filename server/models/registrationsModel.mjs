import { pool } from "../db/postgresConnection.mjs";

const registrationsModel = {
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

  getRegistrationStatusForUser: async () => {
    try {
      const registrations = await pool.query("SELECT * FROM registrations");
      return registrations.rows;
    } catch (error) {
      console.error(error);
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

  getRegistrationsWithReviewInfo: async () => {
    try {
      const query = `
        SELECT 
            r.id AS registration_id, 
            e.title AS excursion_title, 
            e.duration, 
            e.type, 
            e.price, 
            e.image, 
            e.average_rating, 
            r.confirmation, 
            r.name, 
            r.date_time,
            r.has_review
        FROM 
            registrations r
        JOIN 
            excursions e ON r.excursion_id = e.id;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Failed to get registrations with review info:", error);
      throw error;
    }
  },
};

export default registrationsModel;
