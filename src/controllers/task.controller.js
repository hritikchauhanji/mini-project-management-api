import * as TaskService from "../services/task.service.js";
import ApiResponse from "../utils/apiResponse.js";

export const createTask = async (req, res) => {
  const task = await TaskService.createTask(req.body);
  return ApiResponse.success(res, "Task created", { task }, 201);
};

export const addComment = async (req, res) => {
  const comment = await TaskService.addComment(req.params.id, req.body);
  return ApiResponse.success(res, "Comment added", { comment }, 201);
};

export const listTasks = async (req, res) => {
  const result = await TaskService.listTasks(req.query);
  return ApiResponse.success(res, "Tasks fetched", result);
};

export const updateTask = async (req, res) => {
  const task = await TaskService.updateTask(req.params.id, req.body);
  return ApiResponse.success(res, "Task updated", { task });
};
