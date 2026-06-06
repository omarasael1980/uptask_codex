import { ProjectFormData, Project } from "@/types/index";
import ProjectForm from "./ProjectForm";
import Titulo from "../Titulo";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function EditProjectForm({
  projectId,
  data,
}: {
  projectId: Project["_id"];
  data: ProjectFormData;
}) {
  const initialValues: ProjectFormData = {
    projectName: data.projectName,
    clientName: data.clientName,
    projectDescription: data.projectDescription,
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: Project["_id"];
      formData: ProjectFormData;
    }) => updateProject(id, formData),
    onError: (error) => {
      toast.error(`ERROR AL CREAR PROYECTO ${error.message}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      navigate("/");
      toast.success(`Proyecto ${data.projectName} creado correctamente`);
    },
  });
  const handleForm = async (formData: ProjectFormData) => {
    const data = {
      id: projectId,
      formData,
    };
    mutate(data);
  };

  return (
    <>
      <nav>
        <Titulo
          titulo={`Editar Proyecto ${initialValues.projectName}`}
          subtitulo={"Llena el siguiente"}
          resaltado={"Formulario"}
          link={"/"}
          textoLink={"Regresar"}
        />
      </nav>
      <form
        onSubmit={handleSubmit(handleForm)}
        className="mt-10 bg-white shadow-lg p-10 rounded-lg w-3/4 mx-auto"
        noValidate
      >
        <ProjectForm register={register} errors={errors} />
        <input
          type="submit"
          value="Guardar Cambios"
          className="bg-blue-800 rounded-md text-white hover:bg-blue-400 w-full p-3 uppercase font-bold cursor-pointer transition-colors duration-300"
        />
      </form>
    </>
  );
}
