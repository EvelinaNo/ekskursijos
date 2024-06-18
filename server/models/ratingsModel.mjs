import { pool } from "../db/postgresConnection.mjs";

const ratingsModel = {
  // getRatingsForExcursion: async (excursionId) => {
  //   try {
  //     const result = await pool.query(
  //       "SELECT * FROM ratings WHERE excursion_id = $1",
  //       [excursionId]
  //     );
  
  //     return result.rows;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // },

// ekskursijos reitingu pasalinimas
  deleteRatingsByExcursionId: async (excursionId) => {
    try {
      const query = "DELETE FROM ratings WHERE excursion_id = $1";
      await pool.query(query, [excursionId]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
};

export default ratingsModel;