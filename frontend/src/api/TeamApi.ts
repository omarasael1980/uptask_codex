import { isAxiosError } from "axios";
import api from "@/lib/AxiosClient";

import {
  Project,
  TeamMember,
  TeamMemberForm,
  teamMembersSchema,
} from "@/types/index";

//region findAMember
export async function findUserByEmail({
  projectId,
  formData,
}: {
  projectId: Project["_id"];
  formData: TeamMemberForm;
}) {
  try {
    const { data } = await api.post(
      `/projects/${projectId}/team/find`,
      formData
    );

    return data.msg;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return error.response.data.error;
    }
    throw error;
  }
}

//region addMember
export async function addUserToProject({
  projectId,
  id,
}: {
  projectId: Project["_id"];
  id: TeamMember["_id"];
}) {
  try {
    const { data } = await api.post(`/projects/${projectId}/team/`, { id });

    return data.title;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return error.response.data.error;
    }
    throw error;
  }
}

//region getProjectTeam
export async function getProjectTeam(projectId: Project["_id"]) {
  try {
    const { data } = await api.get(`/projects/${projectId}/team`);
    const arrayData = teamMembersSchema.safeParse(data.msg);
    console.log("arrayData", arrayData);
    if (arrayData.success) {
      console.log("arrayData", arrayData.data);
      return arrayData.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      console.log("errorFROMAPI", error.response.data.error);
      return error.response.data.error;
    }
    throw error;
  }
}
//region removeUserFromProject
export async function removeUserFromProject({
  projectId,
  userId,
}: {
  projectId: Project["_id"];
  userId: TeamMember["_id"];
}) {
  try {
    const { data } = await api.delete(`/projects/${projectId}/team/${userId}`);
    console.log("DELETEUSER", data);

    return data.title as string;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      console.log("errorFROMAPI", error.response.data.error);
      return error.response.data.error;
    }
    throw error;
  }
}
