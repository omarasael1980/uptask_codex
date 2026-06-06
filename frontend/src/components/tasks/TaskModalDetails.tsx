import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getATaskById, updateStatusTask } from "@/api/TasksApi";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { statusTranslation } from "@/locales/es";
import { Task } from "@/types/index";
import NotesPanel from "../notes/NotesPanel";
import { Clock, RefreshCw } from "lucide-react";

export default function TaskModalDetails() {
  const location = useLocation();
  const params = useParams();
  const projectId = params.projectId!;
  const queryparams = new URLSearchParams(location.search);
  const taskId = queryparams.get("viewTask");
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getATaskById(projectId, taskId!)!,
    enabled: !!taskId,
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatusTask,
    onError: (error) => {
      toast.error(`Error al actualizar la tarea: ${error.message}`, {
        toastId: "error",
      });
    },
    onSuccess: (data) => {
      toast.success(`${data}`);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      navigate(location.pathname.replace("viewTask", ""));
    },
  });

  const handleChanges = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    mutate({ projectId, taskId: taskId!, status: status as Task["status"] });
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) {
    toast.error(
      `Error al obtener la tarea: ${
        error.message == undefined ? "La tarea no existe" : error.message
      }`,
      {
        toastId: "error",
      }
    );
    return <Navigate to={`/projects/${projectId}`} />;
  }

  const show = taskId ? true : false;

  if (data)
    return (
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => navigate(location.pathname, { replace: true })}
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
            <div className="fixed inset-0 bg-black/70" />
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
                <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Agregada: {formatDate(data.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        <span>Actualización: {formatDate(data.updatedAt)}</span>
                      </div>
                    </div>

                    <Dialog.Title className="font-black text-3xl text-slate-800 mt-6 mb-4">
                      {data.name}
                    </Dialog.Title>

                    <div className="bg-slate-50 p-4 rounded-lg mb-6">
                      <h4 className="text-sm font-medium text-slate-600 mb-2">
                        DESCRIPCIÓN
                      </h4>
                      <p className="text-slate-700">{data.description}</p>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-semibold text-xl text-slate-800 mb-4">
                        Historial de cambios
                      </h4>
                      <div className="space-y-2">
                        {data.completedBy.length > 0 ? (
                          data.completedBy.map(
                            (cambio: Task["completedBy"][number]) => (
                              <div
                                key={cambio?._id}
                                className="flex items-center bg-slate-50 p-3 rounded-lg"
                              >
                                <div className="flex-1">
                                  <span className="font-medium text-slate-700">
                                    {cambio.status}
                                  </span>
                                  <span className="text-slate-500"> por </span>
                                  <span className="font-medium text-blue-800">
                                    {cambio?.user?.name}
                                  </span>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-slate-500 text-center py-4">
                            No hay cambios registrados
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Estado Actual
                      </label>
                      <select
                        onChange={handleChanges}
                        defaultValue={data?.status}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {Object.entries(statusTranslation).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <NotesPanel notes={data.notes} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
}
