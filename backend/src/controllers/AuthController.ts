import User from "../models/User";
import Token from "../models/Token";
import type { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/Auth";
import { generateSixDigitToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateToken } from "../utils/jwt";

//region createUSer
export const createUser = async (req: Request, res: Response) => {
  try {
    let { name, email, password } = req.body;
    name = name.toUpperCase();
    password = await hashPassword(password);
    const token = new Token();

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({
        msg: "El usuario ya existe",
        title: "Error al crear al usuario",
        error: true,
      });
    } else {
      const user = new User({ name, email, password });
      token.token = generateSixDigitToken().toString();
      token.user = user.id;
      //send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      await Promise.allSettled([user.save(), token.save()]);

      res.status(201).json({
        msg: { user, token },
        title: "Confirmar Cuenta para Activarla",
        error: false,
      });
    }
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
  console.log("confirmToken");
  try {
    const { token } = req.body;
    console.log(token);
    const tokenExists = await Token.findOne({ token });
    console.log("TOKEN", tokenExists);
    if (!tokenExists) {
      res.status(401).json({
        msg: "El token no existe",
        title: "Token no encontrado",
        error: true,
      });
    } else {
      const user = await User.findById(tokenExists.user);

      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.status(200).json({
        msg: "Usuario confirmado",
        title: "Usuario confirmado",
        error: false,
      });
    }
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
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        msg: "El usuario no existe",
        title: "Usuario no encontrado",
        error: true,
      });
    } else {
      if (!user.confirmed) {
        //crear nuevo token
        const token = new Token();
        token.token = generateSixDigitToken().toString();
        token.user = user.id;
        await token.save();

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
      } else {
        const isValid = await comparePassword(password, user.password);
        if (isValid) {
          user.password = undefined;
          const token = generateToken({ id: user.id });
          res.status(200).json({
            msg: token,
            title: "Usuario autenticado",
            error: false,
          });
        } else {
          res.status(401).json({
            msg: "Contraseña incorrecta",
            title: "Contraseña incorrecta",
            error: true,
          });
        }
      }
    }
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
  console.log("requestConfirmationCode");
  try {
    let { email } = req.body;

    const emailExist = await User.findOne({ email });

    if (!emailExist) {
      const error = new Error("El usuario no existe");
      res.status(404).json({ error: error.message });
      return;
    }
    if (emailExist.confirmed) {
      const error = new Error("El usuario ya está confirmado");
      res.status(401).json({ error: error.message });
      return;
    }
    const token = new Token();

    token.token = generateSixDigitToken().toString();

    //send email
    AuthEmail.sendConfirmationEmail({
      email: email,
      name: emailExist.name,
      token: token.token,
    });
    await Promise.allSettled([emailExist.save(), token.save()]);

    res.status(201).json({
      msg: { emailExist, token },
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
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        msg: "El usuario no existe",
        title: "Usuario no encontrado",
        error: true,
      });
      return;
    }
    const token = new Token();
    token.token = generateSixDigitToken().toString();
    token.user = user.id;
    await token.save();
    //send email
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

    const tokenExists = await Token.findOne({ token });

    if (!tokenExists) {
      res.status(401).json({
        msg: "El token no existe",
        title: "Token no encontrado",
        error: true,
      });
    } else {
      res.status(200).json({
        msg: "Token confirmado",
        title: "Token confirmado, ingresa la nueva contraseña",
        error: false,
      });
    }
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
    const { token } = req.params;
    const { password } = req.body;

    const tokenExists = await Token.findOne({ token });
    console.log(tokenExists);
    if (!tokenExists) {
      res.status(401).json({
        msg: "El token no existe",
        title: "Token no encontrado",
        error: true,
      });
      return;
    }
    const user = await User.findById(tokenExists.user);
    const passToSave = password.trim().toUpperCase();
    user.password = await hashPassword(passToSave);
    await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
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
    msg: req.user,
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
    name = name.toUpperCase();
    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist.id.toString() !== req.user.id.toString()) {
      res.status(409).json({
        msg: "El email ya existe",
        title: "Error al actualizar el perfil",
        error: true,
      });
      return;
    }
    req.user.name = name;
    req.user.email = email;
    await req.user.save();
    res.status(200).json({
      msg: req.user,
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

    const userExist = await User.findById(id);
    if (!userExist) {
      res.status(404).json({
        msg: "El usuario no existe",
        title: "Usuario no encontrado",
        error: true,
      });
      return;
    }
    //compare current password
    const isValid = await comparePassword(current_password, userExist.password);
    if (!isValid) {
      res.status(401).json({
        msg: "La contraseña actual no es correcta",
        title: "Contraseña incorrecta",
        error: true,
      });
      return;
    }

    userExist.password = await hashPassword(password);
    await userExist.save();
    //delete token
    const tokenExists = await Token.findOne({ user: userExist.id });
    if (tokenExists) {
      await tokenExists.deleteOne();
    }

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
    const user = await User.findById(req.user.id);
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
