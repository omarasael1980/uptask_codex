import { Link } from "react-router-dom";

// Componente Titulo con props tipados correctamente
interface TituloProps {
  titulo: string;
  subtitulo: string;
  resaltado: string;
  link: string;
  textoLink: string;
}

export default function Titulo({
  titulo,
  subtitulo,
  resaltado,
  link,
  textoLink,
}: TituloProps) {
  return (
    <>
      <h1 className="text-5xl font-black text-[#0e4365]"> {titulo} </h1>
      <p className="text-2xl font-bold text-gray-500 my-5">
        {subtitulo}{" "}
        <span className="font-extrabold text-[#097cae]">{resaltado}</span>
      </p>
      <nav className="my-5">
        <Link
          to={link}
          className="bg-[#0e4365] hover:bg-[#097cae] px-10 py-3 text-white rounded-md text-xl font-bold mt-5 cursor-pointer transition-colors"
        >
          {textoLink}
        </Link>
      </nav>
    </>
  );
}
