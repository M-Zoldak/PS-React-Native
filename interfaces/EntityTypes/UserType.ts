import { AppRoleType } from "./AppRoleType";
import { DefaultType } from "./DefaultType";
import { UserNotificationType } from "./UserNotificationType";

export type UserOptionsType = {
  selectedAppId: string;
};

export type CurrentUserType = {
  currentAppRole: AppRoleType;
  userOptions: UserOptionsType;
  notifications: UserNotificationType[];
  userOwnedAppsIds: Array<number>;
} & DefaultType;

export type UserType = DefaultType & {
  appRole: AppRoleType;
};
