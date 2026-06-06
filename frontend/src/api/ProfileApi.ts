import api from "@/lib/AxiosClient";

import { isAxiosError } from "axios";
import { NewProfilePasswordForm, UserProfileForm } from "../types";
//region type
type Response = {
  title: string;
  msg: object;
  error: boolean;
};
//region updateProfile
export async function updateProfile(formData: UserProfileForm) {
  try {
    const { data } = await api.put<Response>("/auth/profile", formData);
    return data?.title;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
//region changeProfilePassword
export async function changeProfilePassword(formData: NewProfilePasswordForm) {
  try {
    const { data } = await api.post<Response>(
      "/auth/update-password",
      formData
    );
    return data?.title;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
