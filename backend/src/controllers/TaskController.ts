import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { serializeTask } from "../utils/serializers";

const taskInclude = {
  project: true,
  completedBy: { include: { user: true }, orderBy: { createdAt: "asc" as const } },
  notes: {
    include: { createdBy: true },
    orderBy: { createdAt: "desc" as const },
  },
} as const;

export class TaskController {
  //region POST createTask
  static createTask = async (req: Request, res: Response) => {
    try {
      let { name, description } = req.body;
      name = name.trim().toUpperCase();
      description = description.trim().toUpperCase();

      await prisma.task.create({
        data: {
          name,
          description,
          projectId: req.project.id,
        },
      });

      res.status(201).json({
        msg: "Tarea creada correctamente",
        title: "Tarea creada",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al crear tarea",
        error: true,
      });
    }
  };

  //region GET getTasks
  static getTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId: req.project.id },
        include: taskInclude,
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({
        msg: tasks.map(serializeTask),
        title: "Tareas",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al obtener tareas",
        error: true,
      });
    }
  };

  //region GET getTaskById
  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await prisma.task.findUnique({
        where: { id: req.task.id },
        include: taskInclude,
      });

      res.status(200).json({
        msg: serializeTask(task),
        title: "Tarea",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al obtener tarea",
        error: true,
      });
    }
  };

  //region PUT updateTask
  static updateTask = async (req: Request, res: Response) => {
    try {
      let { name, description } = req.body;
      name = name.trim().toUpperCase();
      description = description.trim().toUpperCase();

      const task = await prisma.task.update({
        where: { id: req.task.id },
        data: { name, description },
        include: taskInclude,
      });

      res.status(200).json({
        msg: serializeTask(task),
        title: "Tarea actualizada",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al actualizar tarea",
        error: true,
      });
    }
  };

  //region DELETE deleteTask
  static deleteTask = async (req: Request, res: Response) => {
    try {
      await prisma.task.delete({ where: { id: req.task.id } });

      res.status(200).json({
        msg: "Eliminación exitosa",
        title: "Tarea eliminada",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al eliminar tarea",
        error: true,
      });
    }
  };

  //region patchTask
  static updateStatusTask = async (req: Request, res: Response) => {
    try {
      const status = req.body.status.trim().toUpperCase();

      const updatedTask = await prisma.$transaction(async (tx) => {
        await tx.taskStatusLog.create({
          data: {
            taskId: req.task.id,
            userId: req.user.id,
            status,
          },
        });

        return tx.task.update({
          where: { id: req.task.id },
          data: { status },
          include: taskInclude,
        });
      });

      res.status(200).json({
        msg: serializeTask(updatedTask),
        title: "Tarea actualizada",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al actualizar tarea",
        error: true,
      });
    }
  };
}
