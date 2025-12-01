import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createProjectSchema } from "../validators/project.validator.js";
import * as ProjectController from "../controllers/project.controller.js";

const router = Router();

router.post(
  "/",
  auth,
  validate(createProjectSchema),
  asyncHandler(ProjectController.createProject)
);

router.get("/", auth, asyncHandler(ProjectController.listProjects));

export default router;
