import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import userModel from "../models/usersModel.mjs";

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const createJwtStrategy = async () => {
  try {
    const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await userModel.getUserById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false); // User not found
        }
      } catch (error) {
        return done(error, false); // Error during user retrieval
      }
    });
    return jwtStrategy;
  } catch (error) {
    throw new Error("Failed to create JWT strategy");
  }
};

export default createJwtStrategy;