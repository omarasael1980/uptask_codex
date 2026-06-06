import {
  type Request,
  type Response,
  type NextFunction,
  request,
} from "express";
import Project, { IProject } from "../models/Project";
declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}
export const validateProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("tasks");
    // console.log("project", project);
    if (!project) {
      const error = new Error("Proyecto no encontrado");
      res.status(404).json({
        msg: error.message,
        title: "El proyecto no existe",
        error: true,
      });
      return;
    }
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title:
        "Error al obtener proyecto por ID -middleware validateProjectExists",
      error: true,
    });
  }
};
