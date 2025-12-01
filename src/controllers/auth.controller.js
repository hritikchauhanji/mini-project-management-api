import * as AuthService from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";

export const register = async (req, res) => {
  const result = await AuthService.register(req.body);
  return ApiResponse.success(res, "User registered", result, 201);
};

export const login = async (req, res) => {
  const result = await AuthService.login(req.body);
  return ApiResponse.success(res, "Login successful", result, 200);
};
