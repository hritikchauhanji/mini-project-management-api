import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import * as AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/",
  validate(registerSchema),
  asyncHandler(AuthController.register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(AuthController.login)
);

router.post("/logout", asyncHandler(AuthController.logout));

export default router;
