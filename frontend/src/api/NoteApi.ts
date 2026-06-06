import api from "@/lib/AxiosClient";
import { Note, NoteFormData, Project, Task } from "../types";
import { isAxiosError } from "axios";
//region type
type NoteApiType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"];
};
//region createNote
export async function createNote({
  projectId,
  taskId,
  formData,
}: Pick<NoteApiType, "projectId" | "taskId" | "formData">) {
  try {
    const { data } = await api.post(
      `/projects/${projectId}/tasks/${taskId}/notes`,
      formData
    );

    return data.title;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
//region deleteNote
export async function deleteNote({
  projectId,
  taskId,
  noteId,
}: Pick<NoteApiType, "projectId" | "taskId" | "noteId">) {
  try {
    const { data } = await api.delete(
      `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
    );

    return data.msg;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;

    throw error;
  }
}
