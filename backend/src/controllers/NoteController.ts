import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { serializeNote } from "../utils/serializers";

type NoteParams = {
  noteId: string;
};

//region createNote
const createNote = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    await prisma.note.create({
      data: {
        content,
        createdById: req.user.id,
        taskId: req.task.id,
      },
    });

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
    const notes = await prisma.note.findMany({
      where: { taskId: req.task.id },
      include: { createdBy: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(notes.map(serializeNote));
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
    const note = await prisma.note.findUnique({
      where: { id: req.params.noteId },
    });

    if (!note) {
      res.status(404).json({ msg: "Nota no encontrada", error: true });
      return;
    }

    if (note.createdById !== req.user.id) {
      res.status(401).json({
        msg: "No tienes permisos para eliminar esta nota",
        error: true,
      });
      return;
    }

    await prisma.note.delete({ where: { id: note.id } });

    res.status(200).json({ msg: "Nota eliminada correctamente", error: false });
  } catch (error) {
    res.status(500).json({ msg: error.message, error: true });
  }
};

export { createNote, getTasksNotes, deleteNote };
