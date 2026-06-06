import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "@/components/Logo";
export default function PublicLayout() {
  return (
    <>
      <div className="bg-gray-800 min-h-screen">
        <div className="py-10 lg:py-20 mx-auto w-[600px]">
          <div className="flex justify-center items-center w-4/5 mx-auto">
            <Logo />
          </div>
          <div className="bg-[#1a2430] p-10 rounded-lg  shadow-lg mt-4">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
