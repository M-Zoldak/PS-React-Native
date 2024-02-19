import { DefaultType } from "./DefaultType";
import { UserType } from "./UserType";

export type TaskType = DefaultType & {
  completed: boolean;
  assignedTo: UserType;
  startDate: { date: string };
  endDate: { date: string };
};
