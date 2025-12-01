import ApiResponse from "../utils/apiResponse.js";

export const getMe = async (req, res) => {
  return ApiResponse.success(res, "User details fetched", {
    user: req.user,
  });
};
