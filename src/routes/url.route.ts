import express from "express";
import { getUrl, deleteUrl } from "../controllers/url.controller";
import { JWTVerify } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getUrl);
router.route("/").delete(JWTVerify, deleteUrl);

export default router;
