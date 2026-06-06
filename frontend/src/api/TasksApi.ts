import api from "@/lib/AxiosClient";
import { TaskFormData, Project, Task } from "@/types/index";
import { isAxiosError } from "axios";
//region tasks
///projects/679a78c0094380f8bd2f0d39/tasks/

type dataResponse = {
  title: string;
  msg: object;
  error: boolean;
};
export const createTask = async (
  formData: TaskFormData,
  projectId: Project["_id"]
) => {
  try {
    const url = `/projects/${projectId}/tasks/`;
    const { data } = await api.post<dataResponse>(url, formData);
    return data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data.msg;
    }
  }
};

//region getATaskById
///projects/679aef21af30aa161f4113c6/tasks/67ad929d5651938b445ccc20
export const getATaskById = async (
  projectId: Project["_id"],
  taskId: Task["_id"]
) => {
  try {
    const { data } = await api.get<dataResponse>(
      `/projects/${projectId}/tasks/${taskId}`
    );
    const task = data.msg as Task;
    return task;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
//region updateTask
///projects/679aef21af30aa161f4113c6/tasks/67ad929d5651938b445ccc20
export const updateTask = async ({
  projectId,
  taskId,
  formData,
}: {
  projectId: Project["_id"];
  taskId: Task["_id"];
  formData: TaskFormData;
}) => {
  try {
    const { data } = await api.put<dataResponse>(
      `/projects/${projectId}/tasks/${taskId}`,
      formData
    );
    return data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data.msg;
    }
  }
};

//region deleteTask
export const deleteTask = async ({
  projectId,
  taskId,
}: {
  projectId: Project["_id"];
  taskId: Task["_id"];
}) => {
  try {
    const { data } = await api.delete<dataResponse>(
      `/projects/${projectId}/tasks/${taskId}`
    );
    return data.title;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
//region updateStatusTask
///projects/679aef21af30aa161f4113c6/tasks/67ad929d5651938b445ccc20/status
export const updateStatusTask = async ({
  projectId,
  taskId,
  status,
}: {
  projectId: Project["_id"];
  taskId: Task["_id"];
  status: Task["status"];
}) => {
  try {
    const { data } = await api.post<dataResponse>(
      `/projects/${projectId}/tasks/${taskId}/status`,
      { status }
    );
    const response = data.title;
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
