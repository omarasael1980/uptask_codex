import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { NoteFormData } from "../../types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteApi";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
export default function AddNoteForm() {
  const initialValues = {
    content: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.projectId!;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success(data);
    },
  });

  const handleAddNote = async (data: NoteFormData) => {
    mutate({ projectId, taskId, formData: data });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="font-bold">
            Crear Nota
          </label>
          <input
            type="text"
            placeholder="Contenido de la nota"
            className="w-full p-3 border mb-3 border-blue-300"
            {...register("content", {
              required: "El contenido de la nota es requerido",
            })}
          />
          {errors.content && (
            <ErrorMessage>{errors.content?.message}</ErrorMessage>
          )}
        </div>
        <input
          type="submit"
          value="Crear Nota"
          className="bg-blue-900 hover:bg-blue-700 w-full p-2 text-white font-black cursor-pointer"
        />
      </form>
    </>
  );
}
