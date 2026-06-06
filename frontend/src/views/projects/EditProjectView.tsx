import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectApi";
import EditProjectForm from "@/components/Projects/EditProjectForm";

export default function EditProjectView() {
  const params = useParams();
  const { projectId } = params!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId!),
    retry: false,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <Navigate to="/404" />;
  }
  if (data) return <EditProjectForm projectId={projectId!} data={data} />;
}
