import mongoose, { Schema, Document, Types } from "mongoose";
//DICCIONARIO SATATUS DE TAREAS
const taskStatus = {
  PENDING: "PENDIENTE",
  ON_HOLD: "EN ESPERA",
  IN_PROGRESS: "EN PROGRESO",
  UNDER_REVIEW: "EN REVISIÓN",
  COMPLETED: "COMPLETADO",
} as const;
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  notes: Types.ObjectId[];
}

const TaskSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    project: { type: Types.ObjectId, ref: "Project" },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    completedBy: [
      {
        user: { type: Types.ObjectId, ref: "User", default: null },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    notes: [{ type: Types.ObjectId, ref: "Note" }],
  },
  {
    timestamps: true,
  }
);
const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
