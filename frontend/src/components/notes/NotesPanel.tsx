import AddNoteForm from "./AddNoteForm";
import { Note } from "../../types/index";
import NoteDetails from "./NoteDetails";
export default function NotesPanel({ notes }: { notes: Note[] }) {
  return (
    <div>
      <AddNoteForm />
      <div className="divide-y divide-gray-100 mt-10">
        {notes.length > 0 ? (
          <>
            <p className="font-bold text-2xl text-slate-600 my-5">Notas:</p>
            {notes.map((note) => (
              <NoteDetails key={note._id} note={note} />
            ))}
          </>
        ) : (
          <div className="p-5 text-center text-gray-500">No hay notas</div>
        )}
      </div>
    </div>
  );
}
