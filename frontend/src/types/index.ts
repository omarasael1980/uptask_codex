import { z } from "zod";
export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

//region Notes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: userSchema,
  task: z.string(),
  createdAt: z.string(),
});
export type Note = z.infer<typeof noteSchema>;
export type NoteFormData = Pick<Note, "content">;
//region tasks
export const taskStatusSchema = z.enum([
  "PENDIENTE",
  "EN ESPERA",
  "EN PROGRESO",
  "EN REVISIÓN",
  "COMPLETADO",
]);
export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema,
  completedBy: z.array(
    z.object({
      _id: z.string(),
      user: userSchema.or(z.null()),
      status: taskStatusSchema,
    })
  ),
  notes: z.array(noteSchema.extend({ createdBy: userSchema })),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const taskProjectSchema = taskSchema.pick({
  _id: true,
  name: true,
  description: true,
  status: true,
});
export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;
export type TaskProject = z.infer<typeof taskProjectSchema>;
//region Projects
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  projectDescription: z.string(),
  manager: z.string(userSchema.pick({ _id: true })),
  tasks: z.array(taskProjectSchema),
  team: z.array(userSchema.pick({ _id: true })),
});
export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<
  Project,
  "projectName" | "clientName" | "projectDescription"
>;

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    projectDescription: true,
    manager: true,
  })
);
//region Login
//UserLoginForm;
export const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  current_password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

type Auth = z.infer<typeof authSchema>;
export type AuthFormData = Pick<Auth, "email" | "password">;
export type ConfirmToken = Pick<Auth, "token">;
export type CheckPasswordForm = Pick<Auth, "password">;
export const userLoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type UserLoginForm = z.infer<typeof userLoginFormSchema>;
export type UserRegistrationForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;

export type RequestConfirmationCodeForm = Pick<Auth, "email">;
export type ForgotPasswordForm = Pick<Auth, "email">;
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;
export type NewProfilePasswordForm = Pick<
  Auth,
  "password" | "password_confirmation" | "current_password"
>;
//region Users

export type User = z.infer<typeof userSchema>;
export type UserProfileForm = Pick<User, "name" | "email">;
export type UserFormData = Pick<User, "name" | "email">;
//region Team

const teamMemberSchema = userSchema.pick({
  name: true,
  email: true,
  _id: true,
});

export const teamMembersSchema = z.array(teamMemberSchema);
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, "email">;
