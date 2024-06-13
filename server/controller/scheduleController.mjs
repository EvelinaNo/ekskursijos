import scheduleModel from "../models/scheduleModel.mjs";

const scheduleController = {
  getExcursionSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await scheduleModel.getExcursionSchedule(id);
      res.status(200).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Naujos datos ir laiko ekskursijai pridejimas
  addExcursionTimeSlot: async (req, res) => {
    try {
      const { excursion_id, date_time } = req.body;
      const newTimeSlot = await scheduleModel.addExcursionTimeSlot(
        excursion_id,
        date_time
      );

      res.status(201).json(newTimeSlot);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while adding time slot" });
    }
  },

  deleteExcursionTimeSlot: async (req, res) => {
    try {
      const { id } = req.params;
      await scheduleModel.deleteExcursionTimeSlot(id);
      res.status(200).json({ message: "Time slot deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting time slot" });
    }
  },
};

export default scheduleController;
