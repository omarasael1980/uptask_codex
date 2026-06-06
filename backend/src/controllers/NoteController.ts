import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";
type NoteParams = {
  noteId: string;
};
//region createNote
const createNote = async (req: Request<{}, {}, INote>, res: Response) => {
  try {
    const { content } = req.body;
    const createdBy = req.user._id;
    const task = req.task._id;

    const note = new Note({
      content,
      createdBy,
      task,
    });

    req.task.notes.push(note.id);
    await Promise.allSettled([note.save(), req.task.save()]);
    res.status(201).json({
      msg: "Nota creada correctamente",
      title: "Nota creada",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al crear nota",
      error: true,
    });
  }
};
//region getTasksNotes
const getTasksNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ task: req.task._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al obtener las notas",
      error: true,
    });
  }
};

//region deleteNote
const deleteNote = async (
  req: Request<NoteParams>,
  res: Response
): Promise<void> => {
  try {
    const noteId = new Types.ObjectId(req.params.noteId);
    const note = await Note.findById(noteId);

    if (!note) {
      res.status(404).json({ msg: "Nota no encontrada", error: true });
      return;
    }
    console.log("1", note.createdBy.toString());
    console.log("2", req.user);
    if (note.createdBy.toString() !== req.user.id.toString()) {
      res.status(401).json({
        msg: "No tienes permisos para eliminar esta nota",
        error: true,
      });
      return;
    }
    req.task.notes = req.task.notes.filter(
      (note) => note.toString() !== noteId.toString()
    );

    await Promise.allSettled([req.task.save(), note.deleteOne()]);

    res.status(200).json({ msg: "Nota eliminada correctamente", error: false });
  } catch (error) {
    res.status(500).json({ msg: error.message, error: true });
  }
};

export { createNote, getTasksNotes, deleteNote };
