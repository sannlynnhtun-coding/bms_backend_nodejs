import { checkSchema } from "express-validator";

const updateUserValidation = () => {
  return checkSchema({
    name: {
      optional: true,
      notEmpty: true,
      isAlpha: true,
      errorMessage: "Name must contain only alphabet.",
    },
    password: {
      optional: true,
      notEmpty: true,
      isStrongPassword: true,
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters.",
      },
      errorMessage:
        "Password must contain 1 uppercase, 1 lowercase, 1 digit and 1 special character.",
    },
    email: {
      optional: true,
      notEmpty: {
        errorMessage: "Email must not empty.",
      },
      isEmail: true,
      errorMessage: "Invalid email",
    },
    stateCode: {
      optional: true,
      notEmpty: true,
      errorMessage: "StateCode must not empty.",
    },
    townshipCode: {
      optional: true,
      notEmpty: true,
      errorMessage: "TownshipCode must not empty.",
    },
    adminId: {
      optional: true,
      notEmpty: true,
      errorMessage: "AdminId must not empty.",
    },
  });
};

const createUserValidation = () => {
  return checkSchema({
    name: {
      notEmpty: true,
      isAlpha: true,
      errorMessage: "Name must contain only alphabet.",
    },
    password: {
      notEmpty: true,
      isStrongPassword: true,
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters.",
      },
      errorMessage:
        "Password must contain 1 uppercase, 1 lowercase, 1 digit and 1 special character.",
    },
    email: {
      notEmpty: {
        errorMessage: "Email must not empty.",
      },
      isEmail: true,
      errorMessage: "Invalid email",
    },
    stateCode: {
      notEmpty: true,
      errorMessage: "StateCode must not empty.",
    },
    townshipCode: {
      notEmpty: true,
      errorMessage: "TownshipCode must not empty.",
    },
    adminId: {
      notEmpty: true,
      errorMessage: "AdminId must not empty.",
    },
  });
};

export { createUserValidation, updateUserValidation };
