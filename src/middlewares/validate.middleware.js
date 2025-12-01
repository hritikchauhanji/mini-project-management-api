import ApiError from "../utils/apiError.js";

export default function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const fieldErrors = {};

      for (const detail of error.details) {
        const field = detail.context.key;

        if (!fieldErrors[field]) {
          const msg = detail.message.replace(/"/g, "");
          fieldErrors[field] = {
            field,
            message: msg,
          };
        }
      }

      const errors = Object.values(fieldErrors);

      return next(ApiError.unprocessable("Validation Error", errors));
    }

    next();
  };
}
