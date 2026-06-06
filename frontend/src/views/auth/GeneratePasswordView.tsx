import { useState } from "react";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import NewPasswordToken from "@/components/auth/NewPasswordToken";
import { ConfirmToken } from "@/types/index";
export default function GeneratePasswordView() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      {" "}
      <div className="  flex flex-col   justify-center items-center m-0 p-0">
        {" "}
        <h1 className="text-5xl font-black text-white">Restablecer Password</h1>
        <p className="text-2xl font-light text-white mt-5">
          Ingresa el código que recibiste por{""}
          <span className=" text-blue-500 font-bold uppercase text-5xl">
            {" "}
            Email
          </span>
        </p>
      </div>
      {isValidToken ? (
        <NewPasswordForm token={token} />
      ) : (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      )}
    </>
  );
}
