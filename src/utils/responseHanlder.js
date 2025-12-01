export default class ResponseHandler {
  static success(res, message = "Success", data = {}, status = 200) {
    return res.status(status).json({
      status: "success",
      message,
      data,
    });
  }

  static error(res, message = "Error", status = 400, error = null) {
    return res.status(status).json({
      status: "error",
      message,
      error,
    });
  }
}
