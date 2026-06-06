import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TaskForm from "./TaskForm";
import { TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/TasksApi";
import { toast } from "react-toastify";
export default function AddTaskModal() {
  //Leer si el modal existe
  const location = useLocation();
  const queryparams = new URLSearchParams(location.search);
  const modalTask = queryparams.get("newTask");
  const show = modalTask ? true : false;

  //obtener ProjectId de la URL
  const params = useParams();
  const { projectId } = params!;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: (data: { formData: TaskFormData; projectId: string }) =>
      createTask(data.formData, data.projectId),
    onError: (error) => {
      console.log("ERROR", error);
      toast.error(`Error al crear la tarea: ${error}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      toast.success(data);
      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  const handleCreateTask = async (formData: TaskFormData) => {
    if (!projectId) {
      toast.error("Error: No se encontró el ID del proyecto");
      return;
    }
    mutate({ formData, projectId });
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            navigate(location.pathname, { replace: true });
          }}
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
                    Nueva Tarea
                  </Dialog.Title>

                  <p className="text-xl font-bold">
                    Llena el formulario y crea {""}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>
                  <form
                    onSubmit={handleSubmit(handleCreateTask)}
                    className="mt-10 "
                  >
                    <TaskForm register={register} errors={errors} />
                    <input
                      type="submit"
                      value="Guardar Tarea"
                      className="bg-blue-800 mt-5 rounded-md text-white hover:bg-blue-400 w-full p-3 uppercase font-bold cursor-pointer transition-colors duration-300"
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
