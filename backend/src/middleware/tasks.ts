import {
  type Request,
  type Response,
  type NextFunction,
  request,
} from "express";
import Task, { ITask } from "../models/Task";
declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}
export const validateTaskExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate("project");
    // console.log("project", project);
    if (!task) {
      const error = new Error("Tarea no encontrada");
      res.status(404).json({
        msg: error.message,
        title: "La Tarea no existe",
        error: true,
      });
      return;
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al obtener la Tarea por ID -middleware validateTaskExists",
      error: true,
    });
  }
};

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.task.project._id.toString() != req.project.id.toString()) {
    res.status(404).json({
      msg: "La tarea no pertenece al proyecto",
      title: "Acción no permitida",
      error: true,
    });
    return;
  }
  next();
}
export function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user._id.toString() !== req.project.manager.toString()) {
    const error = new Error("Acción no permitida");

    res.status(401).json({
      msg: error.message,
      title: "No autorizado",
      error: true,
    });
    return;
  }

  next();
}
