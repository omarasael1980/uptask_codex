import { Navigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getATaskById } from "@/api/TasksApi";
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {
  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("editTask")!;
  const projectId = params.projectId!;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getATaskById(projectId, taskId),
    enabled: !!taskId,
  });
  if (isError) return <Navigate to="/404" />;
  if (isLoading) return <h1>Loading...</h1>;
  if (data) return <EditTaskModal data={data} />;
}
