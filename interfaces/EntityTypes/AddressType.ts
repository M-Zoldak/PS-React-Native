import { PermissionsType } from "../DefaultTypes";
import { DefaultType } from "./DefaultType";

export type AddressType = DefaultType & {
  appId: number;
  street: string;
  city: string;
  country: string;
  postal: string;
} & PermissionsType;
