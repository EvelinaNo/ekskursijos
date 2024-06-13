import usersModel from "../models/usersModel.mjs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import excursionsModel from "../models/excursionsModel.mjs";

dotenv.config();

const usersController = {
  createUser: async (req, res) => {
    try {
      const { name, email, password, repeatPassword, role = "user" } = req.body;

      //Patikriname, ar toks vartotojas jau egzistuoja
      const existingUser = await usersModel.getUserByEmail(email);

      if (existingUser) {
        res.status(400).json({ message: "Email already exists." });
        return;
      }

      if (password !== repeatPassword) {
        res.status(400).json({ message: "Passwords do not match." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Sukuriame naują vartotoją su užhash'uotu slaptažodžiu
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role,
      };

      const createdUser = await usersModel.createUser(newUser);

      res.status(201).json(createdUser);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while creating the user." });
    }
  },
  login: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await usersModel.login({ email });
      res.status(200).json({ message: "User Logged in successfully", user });
    } catch (error) {
      if (
        error.message === "User not found" ||
        error.message === "Invalid credentials."
      ) {
        res.status(401).json({ message: error.message });
      } else {
        console.error(error);
        res
          .status(500)
          .json({ message: "An error occurred while logging in." });
      }
    }
  },

  // vieno user'io ekskursiju gavimas
  getUserExcursions: async (req, res) => {
    try {
      const userId = req.params.userId;
      const excursions = await usersModel.getUserExcursions(userId);
      res.json(excursions);
    } catch (error) {
      console.error("Failed to get user's excursions:", error);
      res
        .status(500)
        .json({ message: "An error occurred while getting user's excursions" });
    }
  },

  // userio ekskursijos atsaukimas
  cancelRegistration: async (req, res) => {
    try {
      const registrationId = req.params.registrationId;
      await usersModel.cancelRegistration(registrationId);
      res.status(204).send(); // No content in response
    } catch (error) {
      console.error("Failed to cancel registration:", error);
      res
        .status(500)
        .json({ message: "An error occurred while canceling registration" });
    }
  },

  getExcursionDetails: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assuming `req.user` contains authenticated user's info

    try {
      const excursion = await excursionsModel.getExcursionById(id);
      const hasVisited = await usersModel.hasVisitedExcursion(userId, id);

      return res.status(200).json({ excursion, hasVisited });
    } catch (error) {
      console.error("Error getting excursion details:", error);
      return res
        .status(500)
        .json({ message: "Failed to get excursion details" });
    }
  },
};

export default usersController;
