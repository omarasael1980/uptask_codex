import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectApi";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useMemo } from "react";
export default function ProjectDetailsView() {
  const { data: user, isLoading: authLoading } = useAuth();
  const params = useParams();
  const { projectId } = params!;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId!),
    retry: false,
  });
  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  if (isLoading && authLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <Navigate to="/404" />;
  }
  console.log("DATA", data);
  console.log("USER", user);
  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.projectDescription}
        </p>
        {isManager(user?._id, data.manager) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`?newTask=true`)}
              className="bg-blue-500 hover:bg-red-400 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            >
              Agregar Tarea
            </button>
            <Link
              className="bg-blue-800 hover:bg-red-400 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
              to={"team"}
            >
              Colaboradores
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEdit={canEdit} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
