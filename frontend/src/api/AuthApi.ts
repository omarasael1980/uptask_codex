import api from "@/lib/AxiosClient";
import { isAxiosError } from "axios";
import {
  UserRegistrationForm,
  ConfirmToken,
  UserLoginForm,
  NewPasswordForm,
  userSchema,
  CheckPasswordForm,
} from "../types";
type Response = {
  title: string;
  msg: object;
  error: boolean;
};
//region createAccount
export async function createAccount(formData: UserRegistrationForm) {
  try {
    const response = await api.post("/auth/create-account", formData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
}

//region Confir-account
export async function confirmAccount(token: ConfirmToken) {
  try {
    const response = await api.post("/auth/confirm-account", token);
    return response.data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.message;
    }
    throw error;
  }
}

//region requestNewCode
export async function requestNewCode(email: string) {
  try {
    const response = await api.post("/auth/request-confirmation-code", {
      email,
    });

    return response.data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data.error;
    }
    throw error;
  }
}
//region Login
export async function authenticateUser(formData: UserLoginForm) {
  try {
    const { data } = await api.post("/auth/login", formData);
    localStorage.setItem("AUTH_TOKEN", data.msg);
    return data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data.msg;
    }
    throw error;
  }
}
//region forgotPassword
export async function forgotPassword(email: string) {
  try {
    const response = await api.post<Response>("/auth/forgot-password", {
      email,
    });
    return response.data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data.msg;
    }
    throw error;
  }
}
//region validateToken
export async function validateToken(token: ConfirmToken) {
  try {
    console.log("token", token);
    const { data } = await api.post<Response>("/auth/validate-token", token);
    return data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data.msg;
    }
    throw error;
  }
}
//region restorePassword
export async function restorePassword({
  formData,
  token,
}: {
  formData: NewPasswordForm;
  token: ConfirmToken["token"];
}) {
  try {
    const { data } = await api.post<Response>(
      `/auth/update-password/${token}`,
      formData
    );
    return data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data.msg;
    }
    throw error;
  }
}
//region get Authtenticated User
export async function getAuthenticatedUser() {
  try {
    const { data } = await api("/auth/user");
    const user = data.msg;
    const response = userSchema.safeParse(user);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}
//region validatePass
export async function validatePassword({ password }: CheckPasswordForm) {
  try {
    console.log("password desde api", password);
    const { data } = await api.post<Response>("/auth/check-password", {
      password,
    });
    console.log("data desde api", data);
    return data?.title;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("error desde api", error);
      throw new Error(
        error.response?.data.msg || "Error al validar la contraseña"
      );
    }
    throw error;
  }
}
