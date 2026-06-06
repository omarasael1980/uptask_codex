import { deleteNote } from "@/api/NoteApi";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function NoteDetails({ note }: { note: Note }) {
  const { data, isLoading } = useAuth();
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);
  const params = useParams();
  const projectId = params.projectId!;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success(data);
    },
  });
  const handleDelete = async () => {
    mutate({ projectId, taskId, noteId: note._id });
  };
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="p-3 flex justify-between items-center bg-slate-50">
      <div>
        <p>
          <span className="font-bold text-blue-800">
            {note.createdBy.name}:{" "}
          </span>
          {note.content}
        </p>
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>
      {canDelete && (
        <button
          onClick={handleDelete}
          type="button"
          className="bg-red-700 text-white rounded-md p-2 cursor-pointer hover:bg-red-500 transition-colors font-bold"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
