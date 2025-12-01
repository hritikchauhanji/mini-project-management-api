import Joi from "joi";

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  owner_id: Joi.string().uuid().optional(),
});
