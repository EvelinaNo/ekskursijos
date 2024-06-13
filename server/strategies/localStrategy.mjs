import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import userModel from "../models/usersModel.mjs";

const localStrategy = new LocalStrategy(
  {
    usernameField: "login",
    passwordField: "password",
  },
  async (login, password, done) => {
    try {
      const user = await userModel.login({ email: login });

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Invalid credentials." });
      }

      return done(null, user);
    } catch (error) {
      if (error.message === "User not found") {
        return done(null, false, { message: error.message });
      }
    }
  }
);

export default localStrategy;