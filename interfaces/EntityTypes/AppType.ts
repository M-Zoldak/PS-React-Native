import { PermissionsType } from "../DefaultTypes";
import { AppRoleType } from "./AppRoleType";
import { DefaultType } from "./DefaultType";
import { ProjectStateType } from "./ProjectStateType";
import { UserType } from "./UserType";
import { WebsiteOptionsType } from "./WebsiteOptionsType";

export type AppType = DefaultType & {
  ownerId: string;
  defaultRoleId: string;
  statistics: {
    usersCount: number;
  };
  websiteOptions: WebsiteOptionsType;
  currentUserRole: AppRoleType;
  projectStates: ProjectStateType[];
};

export type AppOptionsType = {
  app: AppType;
  roles: Array<AppRoleType>;
  users: Array<UserType>;
  invitedUsers: Array<UserType>;
  websiteOptions: WebsiteOptionsType;
  form: any;
};
