import { AddressType } from "./AddressType";
import { ContactPersonType } from "./ContactPersonType";
import { DefaultType } from "./DefaultType";

export type ClientType = DefaultType & {
  appId: number;
  fax: string;
  phone: string;
  mobile: string;
  addresses: AddressType[];
  employees: ContactPersonType[];
};
