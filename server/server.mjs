import express from "express";
import dotenv from "dotenv";
import passport from "./strategies/auth.mjs";
import { connectDB } from "./db/postgresConnection.mjs";
import usersRouter from "./routes/index.mjs";
import excursionsRouter from "./routes/index.mjs";
import cors from "cors";

dotenv.config();

const app = express();

const startServer = async () => {
  try {
    const message = await connectDB();
    console.log(message);

    // Allow requests from your frontend domain
    app.use(
      cors({
        origin: "http://localhost:5173", // Change this to your frontend URL
        credentials: true, // Allow cookies and authorization headers
      })
    );
    app.use(express.json()); //must be before the route !!
    app.use(passport.initialize());

    app.use("/api/triptrack", usersRouter, excursionsRouter);

    const PORT = process.env.PORT || 1000;

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the server or database", error);
  }
};

startServer();