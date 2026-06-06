import {
  dashboardProjectSchema,
  ProjectFormData,
  Project,
  projectSchema,
} from "@/types/index";
import api from "@/lib/AxiosClient";
import { AxiosError } from "axios";
//region createProject
export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post("/projects", formData);
    return data.title;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

//region getProjects

export async function getProjects() {
  try {
    const { data } = await api("/projects");
    const response = dashboardProjectSchema.safeParse(data.msg);

    if (response.success === true) {
      return response.data;
    } else {
      throw new Error("La respuesta no tiene el formato esperado");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;

    return [];
  }
}

//region editar proyecto
export async function getProjectById(id: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${id}`);
    return data.msg;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;

    return [];
  }
}
//region proyectoCompleto
export async function getFullProject(id: Project["_id"]) {
  try {
    console.log("ID", id);
    const { data } = await api(`/projects/${id}`);
    const response = data.msg;
    const ares = projectSchema.safeParse(response);
    if (ares.success) {
      return ares.data;
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;

    return [];
  }
}

//region Actualizar proyecto

export async function updateProject(
  id: Project["_id"],
  formData: ProjectFormData
) {
  try {
    const { data } = await api.put(`/projects/${id}`, formData);
    console.log("UPDATED", data);
    return data.msg;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;

    return [];
  }
}
//region deleteProject
export async function deleteProject(id: Project["_id"]) {
  try {
    const { data } = await api.delete(`/projects/${id}`);
    console.log("DELETED", data);
    return data.msg;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
