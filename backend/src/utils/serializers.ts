type UserLike = {
  id: string;
  name: string;
  email: string;
  confirmed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export const serializeUser = (user: UserLike) => ({
  _id: user.id,
  id: user.id,
  name: user.name,
  email: user.email,
  confirmed: user.confirmed,
  createdAt: user.createdAt?.toISOString(),
  updatedAt: user.updatedAt?.toISOString(),
});

export const serializePublicUser = (user: UserLike) => ({
  _id: user.id,
  id: user.id,
  name: user.name,
  email: user.email,
});

export const serializeNote = (note: any) => ({
  _id: note.id,
  id: note.id,
  content: note.content,
  createdBy: note.createdBy ? serializePublicUser(note.createdBy) : note.createdById,
  task: note.taskId,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt?.toISOString(),
});

export const serializeTask = (task: any) => ({
  _id: task.id,
  id: task.id,
  name: task.name,
  description: task.description,
  project: task.projectId,
  status: task.status,
  completedBy: (task.completedBy ?? []).map((item: any) => ({
    _id: item.id,
    id: item.id,
    user: item.user ? serializePublicUser(item.user) : null,
    status: item.status,
  })),
  notes: (task.notes ?? []).map(serializeNote),
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

export const serializeTaskPreview = (task: any) => ({
  _id: task.id,
  id: task.id,
  name: task.name,
  description: task.description,
  status: task.status,
});

export const serializeProject = (project: any) => ({
  _id: project.id,
  id: project.id,
  projectName: project.projectName,
  clientName: project.clientName,
  projectDescription: project.projectDescription,
  manager: project.managerId,
  tasks: (project.tasks ?? []).map(serializeTaskPreview),
  team: (project.team ?? []).map((member: any) => serializePublicUser(member.user)),
  createdAt: project.createdAt?.toISOString(),
  updatedAt: project.updatedAt?.toISOString(),
});
