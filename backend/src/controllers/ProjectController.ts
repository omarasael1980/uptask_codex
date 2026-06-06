import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { serializeProject } from "../utils/serializers";

const projectInclude = {
  tasks: true,
  team: { include: { user: true } },
} as const;

export class ProjectController {
  //region GET getAllProjects
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { managerId: req.user.id },
            { team: { some: { userId: req.user.id } } },
          ],
        },
        include: projectInclude,
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({
        msg: projects.map(serializeProject),
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
      const id = req.params.id as string;
      const project = await prisma.project.findUnique({
        where: { id },
        include: projectInclude,
      });

      if (!project) {
        res.status(404).json({
          msg: "Proyecto no encontrado",
          title: "Error al obtener proyecto",
          error: true,
        });
        return;
      }

      const isMember = project.team.some((member) => member.userId === req.user.id);
      if (project.managerId !== req.user.id && !isMember) {
        res.status(401).json({
          msg: "No tienes permisos para ver este proyecto",
          title: "Error al obtener proyecto",
          error: true,
        });
        return;
      }

      res.status(200).json({
        msg: serializeProject(project),
        title: "Proyecto",
        error: false,
      });
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
      const managerId = req.user.id;

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

      const newProject = await prisma.project.create({
        data: {
          projectName,
          clientName,
          projectDescription,
          managerId,
        },
        include: projectInclude,
      });

      res.status(201).json({
        msg: serializeProject(newProject),
        title: "Proyecto creado",
        error: false,
        data: serializeProject(newProject),
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
      const id = req.params.id as string;
      let { projectName, clientName, projectDescription } = req.body;
      projectName = projectName.trim().toUpperCase();
      clientName = clientName.trim().toUpperCase();
      projectDescription = projectDescription.trim().toUpperCase();

      const project = await prisma.project.findUnique({
        where: { id },
        include: projectInclude,
      });

      if (!project) {
        res.status(404).json({
          msg: "Proyecto no encontrado",
          title: "Error al actualizar proyecto",
          error: true,
        });
        return;
      }

      if (project.managerId !== req.user.id) {
        res.status(401).json({
          msg: "Solo el manager del proyecto puede actualizarlo",
          title: "Error al actualizar proyecto",
          error: true,
        });
        return;
      }

      const updatedProject = await prisma.project.update({
        where: { id },
        data: { projectName, clientName, projectDescription },
        include: projectInclude,
      });

      res.status(200).json({
        msg: serializeProject(updatedProject),
        title: "Proyecto actualizado",
        error: false,
        data: serializeProject(updatedProject),
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
      const id = req.params.id as string;
      const project = await prisma.project.findUnique({ where: { id } });

      if (!project) {
        res.status(404).json({
          msg: "Proyecto no encontrado",
          title: "Error al eliminar proyecto",
          error: true,
        });
        return;
      }

      if (project.managerId !== req.user.id) {
        res.status(401).json({
          msg: "Solo el manager del proyecto puede eliminarlo",
          title: "Error al eliminar el proyecto",
          error: true,
        });
        return;
      }

      await prisma.project.delete({ where: { id } });
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
