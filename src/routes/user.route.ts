import express from "express";
import {
  userRegister,
  userLogin,
  getUser,
  generateShortUrl,
  deleteAccount,
  getAllUrl,
  submitFeedback,
} from "../controllers/user.controller";
import { JWTVerify } from "../middlewares/auth.middleware";

const router = express.Router();

// TODO: Include google authentication.

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);

// Protected Routes
router.route("/profile").get(JWTVerify, getUser);
router.route("/generate-url").post(JWTVerify, generateShortUrl);
router.route("/delete").delete(JWTVerify, deleteAccount);
router.route("/urls").get(JWTVerify, getAllUrl);
router.route("/feedback").post(JWTVerify, submitFeedback);

export default router;
