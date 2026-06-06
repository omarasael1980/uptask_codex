import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Project, TaskProject } from "@/types/index";

import TaskCard from "./TaskCard";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusTask } from "@/api/TasksApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};
export default function TaskList({ tasks, canEdit }: TaskListProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.projectId!;

  const { mutate } = useMutation({
    mutationFn: updateStatusTask,
    onError: (error) => {
      toast.error(error.message);

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
    onSuccess: (data) => {
      toast.success(data);
    },
  });
  type GroupedTask = {
    [key: string]: TaskProject[];
  };
  const initialStatusGroups: GroupedTask = {
    PENDIENTE: [],
    "EN ESPERA": [],
    "EN PROGRESO": [],
    "EN REVISIÓN": [],
    COMPLETADO: [],
  };

  const statusColors: { [key: string]: string } = {
    PENDIENTE: "border-t-slate-500",
    "EN ESPERA": "border-t-red-500",
    "EN PROGRESO": "border-t-amber-500",
    "EN REVISIÓN": "border-t-blue-500",
    COMPLETADO: "border-t-emerald-500",
  };
  const groupedTasks = tasks.reduce((acc: GroupedTask, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && over.id) {
      const taskId = active.id.toString();
      const newStatus = over.id as TaskProject["status"];

      // Actualizar tareas en el estado local antes de llamar a la API
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );

      queryClient.setQueryData(["project", projectId], (oldData: Project) => {
        return { ...oldData, tasks: updatedTasks };
      });

      // Llamar a la mutación para persistir el cambio
      mutate({ projectId, taskId, status: newStatus });
    }
  };

  return (
    <>
      {" "}
      <h2 className="text-5xl font-black my-10">Tareas</h2>
      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <h1
                className={`text-xl font-light border border-slate-300 ${statusColors[status]} bg-white p-3 border-t-8`}
              >
                {status}
              </h1>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="p-8 bg-white border border-slate-300 flex justify-between  gap-3">
                    <p className="text-center w-full text-gray-500 text-lg uppercase font-bold">
                      {" "}
                      No Hay tareas
                    </p>
                  </li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
