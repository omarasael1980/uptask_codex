import { Link, Outlet, Navigate } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateLayout() {
  const { data, isError, isLoading } = useAuth();

  if (isLoading) return <p>Cargando...</p>;

  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  if (data)
    return (
      <>
        <header className="bg-[#383f4f] py-5">
          <div className="max-w-screen-2xl mx-8 flex flex-row justify-between items-center">
            <div className="w-20 md:w-36 mb-4 md:mb-0 items-center">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            <nav className="w-20 md:w-36 mb-4 md:mb-0 items-center">
              <NavMenu username={data.name} />
            </nav>
          </div>
        </header>
        <section className="w-full md:w-5/6 min-h-screen mx-auto mt-10">
          <Outlet />
        </section>
        <footer className="py-5 bg-[#383f4f] text-white">
          <p className="text-center">
            ® Todos los derechos reservados {new Date().getFullYear()}
          </p>
        </footer>
        <ToastContainer />
      </>
    );
}
