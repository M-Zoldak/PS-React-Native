import { UserType } from "./UserType";

export type NoteType = {
  title: string;
  text: string;
  createdAt: { date: string };
  user: UserType;
};
