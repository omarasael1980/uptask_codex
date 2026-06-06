import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { serializePublicUser } from "../utils/serializers";

export class TeamMemberController {
  //region findMemberByEmail
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const email = req.body.email.trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res.status(404).json({ error: "Usuario No Encontrado" });
        return;
      }

      res.status(200).json({
        title: "Usuario Encontrado",
        msg: serializePublicUser(user),
        error: false,
      });
    } catch (error) {
      res.status(500).send({
        msg: error.message,
        title: "Error al validar el usuario",
        error: true,
      });
    }
  };

  //region Add a member to a team
  static addMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        res.status(404).json({ error: "Miembro No Encontrado" });
        return;
      }

      const memberExists = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: req.project.id,
            userId: user.id,
          },
        },
      });

      if (memberExists) {
        res.status(404).json({ error: "Ya es miembro del equipo" });
        return;
      }

      await prisma.projectMember.create({
        data: {
          projectId: req.project.id,
          userId: user.id,
        },
      });

      res.status(200).json({
        title: "Usuario agregado como miembro del equipo",
        msg: serializePublicUser(user),
        error: false,
      });
    } catch (error) {
      res.status(500).send({
        msg: error.message,
        title: "Error al validar el usuario",
        error: true,
      });
    }
  };

  //region removeMemberById
  static removeMemberById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: req.project.id,
            userId,
          },
        },
      });

      if (!member) {
        res.status(404).json({ error: "Este usuario no es miembro del equipo" });
        return;
      }

      await prisma.projectMember.delete({
        where: {
          projectId_userId: {
            projectId: req.project.id,
            userId,
          },
        },
      });

      res.status(200).json({
        title: "Usuario eliminado del equipo",
        msg: userId,
        error: false,
      });
    } catch (error) {
      res.status(500).send({
        msg: error.message,
        title: "Error al validar el usuario",
        error: true,
      });
    }
  };

  //region GetTeamProject
  static getTeamProject = async (req: Request, res: Response) => {
    try {
      const project = await prisma.project.findUnique({
        where: { id: req.params.projectId as string },
        include: { team: { include: { user: true } } },
      });

      if (!project) {
        res.status(404).json({ error: "Proyecto No Encontrado" });
        return;
      }

      res.status(200).json({
        title: "Miembros del equipo",
        msg: project.team.map((member) => serializePublicUser(member.user)),
        error: false,
      });
    } catch (error) {
      res.status(500).send({
        msg: error.message,
        title: "Error al obtener los miembros del equipo",
        error: true,
      });
    }
  };
}
