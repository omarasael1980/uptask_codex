import type { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
  //region findMemberByEmail
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email }).select("id email name");
      if (!user) {
        const error = new Error("Usuario No Encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      res
        .status(200)
        .json({ title: "Usuario Encontrado", msg: user, error: false });
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

      // Find user
      const user = await User.findById(id).select("id");

      if (!user) {
        const error = new Error("Miembro No Encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (
        req.project.team.some((team) => team.toString() === user.id.toString())
      ) {
        const error = new Error("Ya es miembro del equipo");
        res.status(404).json({ error: error.message });
        return;
      }
      req.project.team.push(user);
      await req.project.save();
      res.status(200).json({
        title: "Usuario agregado como miembro del equipo",
        msg: user,
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
      const { userId } = req.params;
      //verificar si existe

      if (
        !req.project.team.some((team) => team.toString() === userId.toString())
      ) {
        const error = new Error("Este usuario no es miembro del equipo");
        res.status(404).json({ error: error.message });
        return;
      }
      //remover miembro del equipo
      req.project.team = req.project.team.filter(
        (teamMember) => teamMember.toString() !== userId
      );
      await req.project.save();
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
      const project = await Project.findById(req.params.projectId)
        .populate("team", "name email")
        .select("team");
      if (!project) {
        const error = new Error("Proyecto No Encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(200).json({
        title: "Miembros del equipo",
        msg: project.team,
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
