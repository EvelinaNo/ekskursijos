
import { checkSchema, param } from 'express-validator';
import userModel from '../models/usersModel.mjs';

export const userValidationSchema = checkSchema({
  name: {
    isLength: {
      options: { min: 6, max: 32 },
      errorMessage:
        'Username must be at least 6 characters with a max of 32 characters',
    },
    notEmpty: {
      errorMessage: 'Username cannot be empty',
    },
    isString: {
      errorMessage: 'Username must be a string!',
    },
  },
  password: {
    isLength: {
      options: { min: 8, max: 128 },
      errorMessage: 'Password must be between 8 and 128 characters',
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^_+=\-';,./|":<>?])[A-Za-z\d@$!%*?&~#^_+=\-';,./|":<>?]{8,128}$/,
      errorMessage:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
    notEmpty: {
      errorMessage: 'Password cannot be empty',
    },
  },
  email: {
    isEmail: {
      errorMessage: 'Email must be valid.',
    },
    notEmpty: {
      errorMessage: 'Email cannot be empty.',
    },
    custom: {
      options: async (value) => {
        const existingUser = await userModel.getUserByEmail({ email: value });
        if (existingUser) {
          throw new Error('Email already exists.');
        }
      },
    },
  },
});

export const loginValidationSchema = [
    checkSchema({
      login: {
        notEmpty: {
          errorMessage: "email cannot be empty",
        },
        custom: {
          options: (value, { req }) => {
            // Check if the value is an email
            if (!value.includes("@")) {
              throw new Error("Login must be a valid email");
            }
            return true; // Return true if validation passes
          },
        },
      },
      password: {
        notEmpty: {
          errorMessage: "Password cannot be empty",
        },
      },
    }),
  ];
