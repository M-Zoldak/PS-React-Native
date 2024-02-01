import { PermissionsType } from "../DefaultTypes";
import { DefaultType } from "./DefaultType";

export type HostingType = DefaultType;

export type WebsiteOptionsType = DefaultType & {
  hostings: Array<HostingType>;
};
