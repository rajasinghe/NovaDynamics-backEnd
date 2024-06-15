import express from "express";
import {
  getUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../Controllers/UserController.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getSingleUser);

router.post("/", createUser);

router.put("/", updateUser);

router.delete("/:id", deleteUser);

export default router;
