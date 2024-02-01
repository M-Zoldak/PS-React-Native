import { DynamicallyFilledObject, PermissionsType } from "../DefaultTypes";
import { AppType } from "./AppType";
import { DefaultType } from "./DefaultType";

export type AppRoleType = DefaultType & {
  isOwnerRole: boolean;
  permissions: UserStandardPermissions;
  ownerApp: AppType;
};

export type UserStandardPermissions = {
  projects?: PermissionsType;
  websites?: PermissionsType;
  clients?: PermissionsType;
  apps: PermissionsType;
} & DynamicallyFilledObject<PermissionsType | any>;
