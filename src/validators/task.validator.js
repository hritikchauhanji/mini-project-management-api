import Joi from "joi";

export const createTaskSchema = Joi.object({
  project_id: Joi.string().uuid().required(),
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  assigned_to: Joi.string().uuid().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid("todo", "in_progress", "done").optional(),
  assigned_to: Joi.string().uuid().allow(null).optional(),
});

export const commentSchema = Joi.object({
  user_id: Joi.string().uuid().required().messages({
    "any.required": "user_id is required",
    "string.guid": "user_id must be a valid UUID",
  }),
  message: Joi.string().min(1).required(),
});
