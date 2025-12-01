import Joi from "joi";

const strongPassword = Joi.string()
  .min(8)
  .pattern(/[A-Z]/, "uppercase")
  .pattern(/[a-z]/, "lowercase")
  .pattern(/[0-9]/, "number")
  .pattern(/[\W_]/, "special character")
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.name": "Password must contain at least one {#name}",
  });

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: strongPassword,
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
