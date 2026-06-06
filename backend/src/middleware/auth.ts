import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { verifyToken } from "../utils/jwt";
import { IUser } from "../models/User";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
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
    const user = await User.findById(isValid.id).select("-password");
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({
        msg: "No autorizado",
        title: "No autorizado",
        error: true,
      });
      return;
    }
  }
};
