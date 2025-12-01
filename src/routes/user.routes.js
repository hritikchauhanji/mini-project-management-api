import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import auth from "../middlewares/auth.middleware.js";
import * as UserController from "../controllers/user.controller.js";

const router = Router();

router.get("/", auth, asyncHandler(UserController.getMe));

export default router;
