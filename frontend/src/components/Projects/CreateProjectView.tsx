import Titulo from "../Titulo";
import { useForm } from "react-hook-form";
import ProjectForm from "@/components/Projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function CreateProjectView() {
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    projectDescription: "",
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  //useMutation
  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error(`ERROR AL CREAR PROYECTO ${error.message}`);
    },
    onSuccess: (data) => {
      navigate("/");
      toast.success(data);
    },
  });

  const handleForm = async (formData: ProjectFormData) => {
    mutate(formData);
  };
  return (
    <>
      <nav>
        <Titulo
          titulo={"Crear Proyecto"}
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
          value="Crear Proyecto"
          className="bg-blue-800 rounded-md text-white hover:bg-blue-400 w-full p-3 uppercase font-bold cursor-pointer transition-colors duration-300"
        />
      </form>
    </>
  );
}
