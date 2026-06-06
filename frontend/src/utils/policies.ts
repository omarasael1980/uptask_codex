import { Project, TeamMember } from "../types";

export const isManager = (
  userId: TeamMember["_id"],
  managerId: Project["manager"]
) => {
  return userId === managerId;
};
