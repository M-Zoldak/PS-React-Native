import { PermissionsType } from "../DefaultTypes";
import { DefaultType } from "./DefaultType";

export type ContactPersonType = DefaultType & {
  appId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  role: string;
  fax: string;
  phone: string;
  mobile: string;
} & DefaultType;
