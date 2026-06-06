import { useState, useRef, useEffect } from "react";
import { Menu, User, Home, LogOut } from "lucide-react";
import { QueryClient } from "@tanstack/react-query";
import { User as TypeUSer } from "@/types/index";
interface NavMenuProps {
  username?: TypeUSer["name"];
}

export default function NavMenu({ username }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = new QueryClient();
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem("AUTH_TOKEN");
    queryClient.removeQueries({ queryKey: ["user"] });
    window.location.href = "/auth/login";
  };

  // Cierra el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800   transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
        aria-label="Menú de navegación"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition-all duration-200 ease-in-out">
          <div className="py-3 px-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-semibold">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Hola: {username}
                </p>
                <p className="text-xs text-gray-500">Bienvenido a tu cuenta</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <a
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-200   transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-2 h-4 w-4 " />
              Mi Perfil
            </a>

            <a
              href="/"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-200  transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Home className="mr-2 h-4 w-4" />
              Mis Proyectos
            </a>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-amber-200  transition-colors duration-150"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
