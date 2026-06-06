import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { verifyToken } from "../utils/jwt";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401).json({
      msg: "No autorizado",
      title: "No autorizado",
      error: true,
    });
    return;
  }

  const token = bearer.split(" ")[1];
  const isValid = verifyToken(token);

  if (typeof isValid === "object" && isValid.id) {
    const user = await prisma.user.findUnique({ where: { id: isValid.id } });
    if (user) {
      req.user = user;
      next();
      return;
    }
  }

  res.status(401).json({
    msg: "No autorizado",
    title: "No autorizado",
    error: true,
  });
};
