import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Task, TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/api/TasksApi";
import { toast } from "react-toastify";
type EditTaskModalProps = {
  data: Task;
};

export default function EditTaskModal({ data }: EditTaskModalProps) {
  //obtener ProjectId de la URL
  //Leer si el modal existe
  const location = useLocation();
  const queryparams = new URLSearchParams(location.search);
  const taskId = queryparams.get("editTask");
  const params = useParams();
  const { projectId } = params!;

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      name: data.name,
      description: data.description,
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateTask,
    onError: (error) => {
      console.log("ERROR", error);
      toast.error(`Error al actualizar la tarea: ${error}`);
    },
    onSuccess: (data) => {
      reset();
      queryClient.invalidateQueries();
      navigate(location.pathname.replace("editTask", ""));
      toast.success(data);
    },
  });
  const handleEditTask = (formData: TaskFormData) => {
    if (!projectId || !taskId) {
      toast.error("Missing required parameters for updating task");
      return;
    }
    const data = {
      projectId: projectId,
      taskId: taskId,
      formData,
    };
    mutate(data);
  };
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(location.pathname.replace("editTask", ""))}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                  Editar Tarea
                </Dialog.Title>

                <p className="text-xl font-bold">
                  Realiza cambios a una tarea en {""}
                  <span className="text-fuchsia-600">este formulario</span>
                </p>

                <form
                  onSubmit={handleSubmit(handleEditTask)}
                  className="mt-10 space-y-3"
                  noValidate
                >
                  <TaskForm register={register} errors={errors} />
                  <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Guardar Cambios"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
