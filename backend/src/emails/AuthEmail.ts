import { Transporter } from "nodemailer";
import { transporter } from "../config/nodemailer";

import dotenv from "dotenv";
dotenv.config();
interface iEmail {
  email: string;
  name: string;
  token: string;
}
export class AuthEmail {
  static async sendConfirmationEmail({ email, name, token }: iEmail) {
    //send email
    const info = await transporter.sendMail({
      from: `UpTask <admin.uptask.com>`,
      to: email,
      subject: "Confirma tu cuenta",
      html: `
            <h1>Hola ${name}</h1>
            <p> Has creado una cuenta en UpTask, ya casi está todo listo, solo debes confirmar tu cuenta</p>
          
            <p>Para confirmar tu cuenta haz click en el siguiente enlace, ingresa tu código: <b>${token}</b></p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account/">Confirmar cuenta</a>
            <p>Este token expira en 5 minutos</p>
            `,
    });
    console.log("Message sent: %s", info.messageId);
  }
  static async forgotPasswordEmail({ email, name, token }: iEmail) {
    //send email
    const info = await transporter.sendMail({
      from: `UpTask <admin.uptask.com>`,
      to: email,
      subject: "Cambia tu password",
      html: `
            <h1>Hola ${name}</h1>
            <p> Has solicitado restablecer tu password</p>
          
            <p>Visita el siguiente enlace para restablecer tu password  </p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password/">Restablece tu password</a>
            <p>Ingresa el siguiente código: <b>${token}</b></p>
            <p>Este token expira en 5 minutos</p>
            `,
    });
    console.log("Message sent: %s", info.messageId);
  }
}
