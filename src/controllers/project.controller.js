import * as ProjectService from "../services/project.service.js";
import ApiResponse from "../utils/apiResponse.js";

export const createProject = async (req, res) => {
  const project = await ProjectService.createProject(req.body, req.user);

  return ApiResponse.success(
    res,
    "Project created successfully",
    { project },
    201
  );
};

export const listProjects = async (req, res) => {
  const projects = await ProjectService.listProjects();

  return ApiResponse.success(res, "Projects fetched", { projects });
};
