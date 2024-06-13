import { pool } from "../db/postgresConnection.mjs";

const scheduleModel = {
  getExcursionSchedule: async (excursionId) => {
    try {
      const schedule = await pool.query(
        "SELECT * FROM schedule WHERE excursion_id = $1",
        [excursionId]
      );
      return schedule.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Naujos datos ir laiko ekskursijai pridejimas
  addExcursionTimeSlot: async (excursion_id, date_time) => {
    try {
      const result = await pool.query(
        "INSERT INTO schedule (excursion_id, date_time) VALUES ($1, $2) RETURNING *",
        [excursion_id, date_time]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Ekskursijos datos ir laiko pasalinimas
  deleteExcursionTimeSlot: async (excursionId) => {
    try {
      const result = await pool.query(
        "DELETE FROM schedule WHERE excursion_id = $1 RETURNING *",
        [excursionId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default scheduleModel;