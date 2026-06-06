import { Request, Response } from "express";
import User from "../models/User";

import Task from "../models/Task";
export class TaskController {
  //region TASKS
  //region POST createTask
  static createTask = async (req: Request, res: Response) => {
    try {
      let { name, description } = req.body;

      //preparando strings
      name = name.trim().toUpperCase();
      description = description.trim().toUpperCase();

      const project = req.project;
      const task = new Task({
        name,
        description,
        project: project._id,
      });
      project.tasks.push(task.id);

      await Promise.allSettled([project.save(), task.save()]);
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
      const project = req.project;

      const tasks = await Task.find({ project: project.id }).populate(
        "project"
      );
      res.status(200).json({
        msg: tasks,
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
      const task = await Task.findById(req.task._id)
        .populate({ path: "completedBy.user", select: "id name email" })
        .populate({
          path: "notes",
          populate: { path: "createdBy", select: "id email name" },
        });

      res.status(200).json({
        msg: task,
        title: "Tarea",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al obtener tarea",
        error: true,
      });
      return;
    }
  };
  //region PUT updateTask
  static updateTask = async (req: Request, res: Response) => {
    try {
      let { name, description } = req.body;
      name = name.trim().toUpperCase();
      description = description.trim().toUpperCase();

      req.task.name = name;
      req.task.description = description;
      req.task.save();

      res.status(200).json({
        msg: req.task,
        title: "Tarea actualizada",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al actualizar tarea",
        error: true,
      });
      return;
    }
  };
  //region DELETE deleteTask
  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (taskId) => taskId.toString() !== req.task.toString()
      );
      await Promise.allSettled([req.project.save(), req.task.deleteOne()]);

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
      let { status } = req.body;
      status = status.trim().toUpperCase();
      req.task.status = status;
      const data = {
        user: req.user.id,
        status,
      };

      req.task.completedBy.push(data);
      const updatedTask = await req.task.save();
      res.status(200).json({
        msg: updatedTask,
        title: "Tarea actualizada",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al actualizar tarea",
        error: true,
      });
      return;
    }
  };
}
