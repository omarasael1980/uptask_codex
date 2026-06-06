import type { NewPasswordForm } from "@/types/index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { restorePassword } from "@/api/AuthApi";
import { toast } from "react-toastify";
import { ConfirmToken } from "@/types/index";

export default function NewPasswordForm({
  token,
}: {
  token: ConfirmToken["token"];
}) {
  const navigate = useNavigate();
  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const { mutate } = useMutation({
    mutationFn: restorePassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (data === "Contraseña actualizada") {
        toast.success(data);
        navigate("/auth/login");
      } else {
        toast.error(data);
      }
    },
  });
  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = {
      formData,
      token,
    };
    mutate(data);
    reset();
  };

  const password = watch("password");

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-8 p-10  bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 6,
                message: "El Password debe ser mínimo de 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Establecer Password"
          className="bg-blue-900 hover:bg-blue-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  );
}
