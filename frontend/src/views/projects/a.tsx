import { getProjects } from "@/api/ProjectApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Titulo from "@/components/Titulo";
import DeleteProjectModal from "@/components/Projects/DeleteProjectModal";
import socket from "@/utils/socket";
import { toast } from "react-toastify";

export default function DashboardView() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("nuevoColaborador", () => {
      toast.success("Te han agregado a un nuevo colaborador en un proyecto.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    });

    return () => {
      socket.off("nuevoColaborador");
    };
  }, [queryClient]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: user, isLoading: authLoading } = useAuth();

  if (isLoading || authLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los proyectos</p>;

  return (
    <>
      <nav>
        <Titulo
          titulo={"Administra tus Proyectos"}
          subtitulo={"Da seguimientos a tus"}
          resaltado={"Proyectos"}
          link={"/projects/create"}
          textoLink={"Crear Proyecto"}
        />
      </nav>

      {data && user && data.length > 0 ? (
        <ul className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
          {data.map((project) => (
            <li
              key={project._id}
              className="flex justify-between gap-x-6 px-5 py-10"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <p
                    className={`font-bold text-xs uppercase rounded-lg w-36 text-center py-1 px-5 ${
                      user._id === project.manager
                        ? "bg-indigo-50 text-indigo-500 border-2 border-indigo-500"
                        : "bg-green-50 text-green-500 border-2 border-green-500"
                    }`}
                  >
                    {user._id === project.manager
                      ? "Administrador"
                      : "Colaborador"}
                  </p>
                  <p className="text-blue-900 text-3xl font-extrabold">
                    {project.projectName}
                  </p>
                  <p className="text-sm text-gray-800">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-sm text-gray-800">
                    {project.projectDescription}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center mt-10 text-gray-400 text-2xl font-bold">
          No hay proyectos aún,{" "}
          <span className="text-blue-800 font-extrabold">Crear Proyecto</span>
        </p>
      )}

      <DeleteProjectModal />
    </>
  );
}
