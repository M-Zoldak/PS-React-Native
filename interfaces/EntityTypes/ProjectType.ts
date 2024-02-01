import { PermissionsType } from "../DefaultTypes";
import { ClientType } from "./ClientType";
import { DefaultType } from "./DefaultType";
import { NoteType } from "./NoteType";
import { ProjectStateType } from "./ProjectStateType";
import { TaskType } from "./TaskType";
import { UserType } from "./UserType";
import { WebsiteType } from "./WebsiteType";

export type ParticipantDefinition = {} & DefaultType;

export type ProjectType = DefaultType & {
  appId: number;
  tasks: TaskType[];
  participants: ParticipantDefinition[];
  client: ClientType;
  website: WebsiteType;
  projectState: ProjectStateType;
  startDate: { date: string };
  endDate: { date: string };
  notes: Array<NoteType>;
} & PermissionsType;
