import { addUserToProject } from "@/api/TeamApi";
import { User } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type SearchResultProps = {
  user: User;
  reset: () => void;
};

export default function SearchResult({ user, reset }: SearchResultProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(`ERROR AL AGREGAR USUARIO AL PROYECTO ${error.message}`);
    },
    onSuccess: (data) => {
      if (data === "Usuario agregado como miembro del equipo") {
        toast.success(` ${data} `);
        reset();
        queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
        navigate(location.pathname, { replace: true });
      } else {
        toast.error(`ERROR AL AGREGAR USUARIO AL PROYECTO, ${data}`);
      }
    },
  });

  const handleSumbit = () => {
    const data = {
      projectId,
      id: user._id,
    };
    mutate(data);
  };

  return (
    <>
      {user && user.name && (
        <>
          <p className="mt-10 text-center text-2xl font-bold">Resultado:</p>
          <div className="flex justify-between items-center">
            <p className="font-bold">{user.name}</p>
            <button
              onClick={handleSumbit}
              className="bg-blue-900 text-white p-1 rounded-md hover:bg-blue-300 px-10 oy-3 font-bold cursor-pointer"
            >
              Agregar al proyecto
            </button>
          </div>
        </>
      )}
    </>
  );
}
