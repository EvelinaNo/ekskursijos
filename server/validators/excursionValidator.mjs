import { checkSchema } from "express-validator";

export const excursionValidationSchema = checkSchema({
  title: {
    trim: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Title must be between 2 and 50 characters",
    },
    isString: {
      errorMessage: "Title must be a string",
    },
  },
  price: {
    isNumeric: {
      errorMessage: "Price must be a number",
    },
  },
  duration: {
    isInt: {
      errorMessage: "Duration must be an integer",
    },
  },
  image: {
    optional: true,
    trim: true,
    isURL: {
      errorMessage: "Image must be a valid URL",
    },
  },
});