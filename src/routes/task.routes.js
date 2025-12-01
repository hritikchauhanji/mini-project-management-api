import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
  commentSchema,
} from "../validators/task.validator.js";
import * as TaskController from "../controllers/task.controller.js";

const router = Router();

router.post(
  "/",
  auth,
  validate(createTaskSchema),
  asyncHandler(TaskController.createTask)
);

router.post(
  "/:id/comments",
  auth,
  validate(commentSchema),
  asyncHandler(TaskController.addComment)
);

router.get("/", auth, asyncHandler(TaskController.listTasks));

router.patch(
  "/:id",
  auth,
  validate(updateTaskSchema),
  asyncHandler(TaskController.updateTask)
);

export default router;
