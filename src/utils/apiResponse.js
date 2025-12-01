export default class ApiResponse {
  constructor(statusCode = 200, message = "Success", data = {}) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

  static success(res, message = "Success", data = {}, status = 200) {
    return res.status(status).json(new ApiResponse(status, message, data));
  }
}
