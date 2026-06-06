import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/Auth";
import { generateSixDigitToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateToken } from "../utils/jwt";
import { serializeUser } from "../utils/serializers";

const createAuthToken = async (userId: string) => {
  return prisma.token.create({
    data: {
      token: generateSixDigitToken().toString(),
      userId,
    },
  });
};

//region createUSer
export const createUser = async (req: Request, res: Response) => {
  try {
    let { name, email, password } = req.body;
    name = name.trim().toUpperCase();
    email = email.trim().toLowerCase();
    password = await hashPassword(password);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(409).json({
        msg: "El usuario ya existe",
        title: "Error al crear al usuario",
        error: true,
      });
      return;
    }

    const user = await prisma.user.create({
      data: { name, email, password },
    });
    const token = await createAuthToken(user.id);

    AuthEmail.sendConfirmationEmail({
      email: user.email,
      name: user.name,
      token: token.token,
    });

    res.status(201).json({
      msg: { user: serializeUser(user), token },
      title: "Confirmar Cuenta para Activarla",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

//region verifyToken
export const confirmToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const tokenExists = await prisma.token.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
    });

    if (!tokenExists) {
      res.status(401).json({
        msg: "El token no existe",
        title: "Token no encontrado",
        error: true,
      });
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenExists.userId },
        data: { confirmed: true },
      }),
      prisma.token.delete({ where: { id: tokenExists.id } }),
    ]);

    res.status(200).json({
      msg: "Usuario confirmado",
      title: "Usuario confirmado",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

//region login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      res.status(404).json({
        msg: "El usuario no existe",
        title: "Usuario no encontrado",
        error: true,
      });
      return;
    }

    if (!user.confirmed) {
      const token = await createAuthToken(user.id);
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      res.status(401).json({
        msg: "El usuario no ha sido confirmado, hemos enviado un email con un nuevo token",
        title: "Usuario no confirmado",
        error: true,
      });
      return;
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      res.status(401).json({
        msg: "Contraseña incorrecta",
        title: "Contraseña incorrecta",
        error: true,
      });
      return;
    }

    const token = generateToken({ id: user.id });
    res.status(200).json({
      msg: token,
      title: "Usuario autenticado",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Problemas al autenticar al usuario",
      error: true,
    });
  }
};

//region requestConfirmationCode
export const requestConfirmationCode = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const emailExist = await prisma.user.findUnique({ where: { email } });

    if (!emailExist) {
      res.status(404).json({ error: "El usuario no existe" });
      return;
    }
    if (emailExist.confirmed) {
      res.status(401).json({ error: "El usuario ya está confirmado" });
      return;
    }

    const token = await createAuthToken(emailExist.id);
    AuthEmail.sendConfirmationEmail({
      email,
      name: emailExist.name,
      token: token.token,
    });

    res.status(201).json({
      msg: { emailExist: serializeUser(emailExist), token },
      title: "Se envió un nuevo token",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

//region fotgotPassword
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({
        msg: "El usuario no existe",
        title: "Usuario no encontrado",
        error: true,
      });
      return;
    }

    const token = await createAuthToken(user.id);
    AuthEmail.forgotPasswordEmail({
      email: user.email,
      name: user.name,
      token: token.token,
    });
    res.status(200).json({
      msg: "Se envió un email con un token para cambiar la contraseña",
      title: "Se envió un email con un token para cambiar la contraseña",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

//region verifyToken
export const validateToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const tokenExists = await prisma.token.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
    });

    if (!tokenExists) {
      res.status(401).json({
        msg: "El token no existe",
        title: "Token no encontrado",
        error: true,
      });
      return;
    }

    res.status(200).json({
      msg: "Token confirmado",
      title: "Token confirmado, ingresa la nueva contraseña",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

//region changePassword
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    const { password } = req.body;

    const tokenExists = await prisma.token.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
    });
    if (!tokenExists) {
      res.status(401).json({
        msg: "El token no existe",
        title: "Token no encontrado",
        error: true,
      });
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenExists.userId },
        data: { password: await hashPassword(password.trim().toUpperCase()) },
      }),
      prisma.token.delete({ where: { id: tokenExists.id } }),
    ]);

    res.status(200).json({
      msg: "Contraseña actualizada",
      title: "Contraseña actualizada",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

export const user = async (req: Request, res: Response) => {
  res.status(200).json({
    msg: serializeUser(req.user),
    title: "Usuario autenticado",
    error: false,
  });
};

//region GetUsers
export const getUsers = async (req: Request, res: Response) => {};
//region GetUser
export const getUser = async (req: Request, res: Response) => {};

//region UpdateUser
export const updateProfile = async (req: Request, res: Response) => {
  try {
    let { name, email } = req.body;
    name = name.trim().toUpperCase();
    email = email.trim().toLowerCase();

    const emailExist = await prisma.user.findUnique({ where: { email } });
    if (emailExist && emailExist.id !== req.user.id) {
      res.status(409).json({
        msg: "El email ya existe",
        title: "Error al actualizar el perfil",
        error: true,
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
    });

    res.status(200).json({
      msg: serializeUser(updatedUser),
      title: "Perfil actualizado",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

//region updatePassword
export const updateCurrentUserPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.user;
    let { password, current_password } = req.body;
    password = password.trim().toUpperCase();
    current_password = current_password.trim().toUpperCase();

    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) {
      res.status(404).json({
        msg: "El usuario no existe",
        title: "Usuario no encontrado",
        error: true,
      });
      return;
    }

    const isValid = await comparePassword(current_password, userExist.password);
    if (!isValid) {
      res.status(401).json({
        msg: "La contraseña actual no es correcta",
        title: "Contraseña incorrecta",
        error: true,
      });
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { password: await hashPassword(password) },
      }),
      prisma.token.deleteMany({ where: { userId: id } }),
    ]);

    res.status(200).json({
      msg: "Contraseña actualizada",
      title: "Contraseña actualizada",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};

//region checkPassword
export const checkPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        msg: "La contraseña no es correcta",
        title: "Contraseña incorrecta",
        error: true,
      });
      return;
    }
    res.status(200).json({
      msg: "Contraseña correcta",
      title: "Contraseña correcta",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Internal server error",
      error: true,
    });
  }
};
