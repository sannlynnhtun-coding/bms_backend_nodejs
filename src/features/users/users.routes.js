import express from "express";
import usersController from "./users.controller.js";
import { createUserValidation } from "./users.validate.js";

const router = express.Router();

router.get("/", usersController.findAllUsers);
router.get("/:id", usersController.findUserById);
router.post("/", createUserValidation(), usersController.createUser);
router.put("/:id", usersController.updateUser);
router.post("/:id/actions", usersController.userActions);
router.delete("/:id", usersController.deleteUser);

export default router;
