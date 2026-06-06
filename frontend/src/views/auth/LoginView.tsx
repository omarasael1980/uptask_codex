import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authenticateUser } from "@/api/AuthApi";
import { useNavigate } from "react-router-dom";
export default function LoginView() {
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const { mutate, reset } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      const err = error as Error;
      toast.error(err.message);
    },
    onSuccess: (data) => {
      if (data === "Usuario autenticado") {
        toast.success(data);
        navigate("/");
      } else {
        toast.error(data);
      }

      reset();
    },
  });
  const handleLogin = (formData: UserLoginForm) => {
    mutate(formData);
  };

  return (
    <>
      <div className="  flex flex-col   justify-center items-center m-0 p-0">
        {" "}
        <h1 className="text-5xl font-black text-white">Inicia Sesión</h1>
        <p className="text-2xl font-light text-white mt-5">
          Ingresa tus{""}
          <span className=" text-[#e8ecef] font-bold uppercase">
            {" "}
            Credenciales
          </span>
        </p>
      </div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white rounded-md shadow-md mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-blue-950 hover:bg-blue-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-10 flex flex-col space-y-4  ">
        <Link
          className="text-center text-gray-300 font-normal"
          to="/auth/register"
        >
          ¿No tienes cuenta? Crear una
        </Link>
        <Link
          className="text-center text-gray-300 font-normal"
          to="/auth/forgot-password"
        >
          Olvidaste tu password? Restablecer
        </Link>
      </nav>
    </>
  );
}
