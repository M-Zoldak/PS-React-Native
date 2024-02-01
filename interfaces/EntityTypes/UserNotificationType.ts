import { DefaultType } from "./DefaultType";

export type UserNotificationType = {
  icon?: string;
  message: string;
  isSeen: boolean;
  actions?: Array<"Redirect" | "Accept" | "Decline">;
} & DefaultType;
