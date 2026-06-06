import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../config/prisma";

export const validateTaskExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.taskId as string;
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        completedBy: { include: { user: true } },
        notes: { include: { createdBy: true } },
      },
    });

    if (!task) {
      res.status(404).json({
        msg: "Tarea no encontrada",
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
  if (req.task.projectId !== req.project.id) {
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
  if (req.user.id !== req.project.managerId) {
    res.status(401).json({
      msg: "Acción no permitida",
      title: "No autorizado",
      error: true,
    });
    return;
  }

  next();
}
