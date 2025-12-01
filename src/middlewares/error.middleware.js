import ApiError from "../utils/apiError.js";

export default function errorHandler(err, req, res, next) {
  console.error("Error Handler:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (err?.isJoi || err?.details) {
    const details = err.details || [];
    const messages = details.map((d) => d.message);

    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message || null,
  });
}
