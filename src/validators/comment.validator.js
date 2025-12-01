import Joi from "joi";

export const commentSchema = Joi.object({
  message: Joi.string().min(1).required(),
});
