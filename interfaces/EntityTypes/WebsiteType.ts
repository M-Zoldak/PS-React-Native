import { PermissionsType } from "../DefaultTypes";
import { ClientType } from "./ClientType";
import { DefaultType } from "./DefaultType";
import { HostingType } from "./WebsiteOptionsType";

export type WebsiteType = DefaultType & {
  hosting: HostingType;
  domain: string;
  client: ClientType;
} & PermissionsType;
