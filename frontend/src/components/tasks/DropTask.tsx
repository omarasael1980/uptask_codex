import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

export default function DropTask({ status }: { status: string }) {
  const [over, setOver] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  useEffect(() => {
    setOver(isOver);
  }, [isOver]);

  return (
    <div
      ref={setNodeRef}
      className={`
        text-xs font-semibold uppercase p-4 border-2 mt-5 grid place-content-center text-slate-500 
        transition-all duration-300 ease-in-out rounded-lg 
        ${
          over
            ? "border-blue-500 bg-blue-200 scale-105 shadow-lg"
            : "border-slate-800 bg-white"
        }
      `}
    >
      Soltar Tarea Aquí - {status}
    </div>
  );
}
