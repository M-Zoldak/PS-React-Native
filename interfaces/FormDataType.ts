import { HTMLInputTypeAttribute } from "react";
import { DynamicallyFilledObject } from "./DefaultTypes";

export type FormDataType = {
  type: HTMLInputTypeAttribute;
  name: string;
  label: string;
  error: string;
  value?: string | any;
  options: Array<{ value: number; label: string }>;
} & DynamicallyFilledObject<string>;
