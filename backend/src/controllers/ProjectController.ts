import { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";
export class ProjectController {
  //region GET getAllProjects
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const { id } = req.user;

      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });

      res.status(200).json({
        msg: projects,
        title: "Proyectos",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al obtener proyectos",
        error: true,
      });
    }
  };
  //region GET getProjectById
  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        res.status(404).json({
          msg: "Proyecto no encontrado",
          title: "Error al obtener proyecto",
          error: true,
        });
        return;
      } else {
        if (
          project.manager.toString() !== req.user.id.toString() &&
          !project.team.includes(req.user.id)
        ) {
          res.status(401).json({
            msg: "No tienes permisos para ver este proyecto",
            title: "Error al obtener proyecto",
            error: true,
          });
          return;
        }
        res.status(200).json({
          msg: project,
          title: "Proyecto",
          error: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al obtener proyecto",
        error: true,
      });
    }
  };
  //region POST createProject
  static createProject = async (req: Request, res: Response) => {
    try {
      let { projectName, clientName, projectDescription } = req.body;
      console.log("RecuperarUSer", req.user);
      //assignar el manager del proyecto
      const manager = req.user.id;

      projectName = projectName.trim().toUpperCase();
      clientName = clientName.trim().toUpperCase();
      projectDescription = projectDescription.trim().toUpperCase();

      if (!projectName || !clientName || !projectDescription) {
        res.status(400).json({
          msg: "Por favor, llene todos los campos",
          title: "Error al crear proyecto",
          error: true,
        });
        return;
      }
      const newProject = new Project({
        projectName,
        clientName,
        projectDescription,
        manager,
      });
      const proyectoCreado = await newProject.save();
      res.status(201).json({
        msg: proyectoCreado,
        title: "Proyecto creado",
        error: false,
        data: newProject,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al crear proyecto",
        error: true,
      });
    }
  };
  //region  PUT updateProject
  static updateProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let { projectName, clientName, projectDescription } = req.body;
      projectName = projectName.trim().toUpperCase();
      clientName = clientName.trim().toUpperCase();
      projectDescription = projectDescription.trim().toUpperCase();

      const project = await Project.findByIdAndUpdate(
        id,
        {
          projectName,
          clientName,
          projectDescription,
        },
        { new: true }
      );
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({
          msg: error.message,
          title: "Error al actualizar proyecto",
          error: true,
        });
      }
      if (project.manager.toString() !== req.user.id) {
        res.status(401).json({
          msg: "Solo el manager del proyecto puede actualizarlo",
          title: "Error al actualizar proyecto",
          error: true,
        });
        return;
      }
      res.status(200).json({
        msg: project,
        title: "Proyecto actualizado",
        error: false,
        data: project,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al actualizar proyecto",
        error: true,
      });
    }
  };
  //region DELETE deleteProject
  static deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({
          msg: error.message,
          title: "Error al eliminar proyecto",
          error: true,
        });
        return;
      }
      if (project.manager.toString() !== req.user.id) {
        res.status(401).json({
          msg: "Solo el manager del proyecto puede eliminarlo",
          title: "Error al eliminar el proyecto",
          error: true,
        });
        return;
      }
      res.status(200).json({
        msg: "El proyecto ha sido eliminado correctamente",
        title: "Proyecto eliminado",
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
        title: "Error al eliminar proyecto",
        error: true,
      });
    }
  };
}
