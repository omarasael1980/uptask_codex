import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../config/prisma";

export const validateProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId as string;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: true,
        team: { include: { user: true } },
      },
    });

    if (!project) {
      res.status(404).json({
        msg: "Proyecto no encontrado",
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
