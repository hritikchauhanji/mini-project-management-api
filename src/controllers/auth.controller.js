import * as AuthService from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";
import { cookieOptions } from "../config/cookieOptions.js";

export const register = async (req, res) => {
  const result = await AuthService.register(req.body);
  return ApiResponse.success(res, "User registered", result, 201);
};

export const login = async (req, res) => {
  const { user, token } = await AuthService.login(req.body);
  res.cookie("token", token, cookieOptions);
  return ApiResponse.success(res, "Login successful", { user }, 200);
};

export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return ApiResponse.success(res, "Logged out successfully");
};
