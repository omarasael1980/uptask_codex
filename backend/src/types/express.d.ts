import type { Prisma } from "@prisma/client";

export type AuthUser = Prisma.UserGetPayload<{}>;
export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    tasks: true;
    team: { include: { user: true } };
  };
}>;
export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    project: true;
    completedBy: { include: { user: true } };
    notes: { include: { createdBy: true } };
  };
}>;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      project?: ProjectWithRelations;
      task?: TaskWithRelations;
    }
  }
}
