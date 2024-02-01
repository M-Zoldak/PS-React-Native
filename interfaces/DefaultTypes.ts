export interface defaultEntityData {
  id: number;
}

export type DynamicallyFilledObject<T> = {
  [key: string]: T;
};

export type ActionButtonsType = {
  deleteable?: boolean | ((item: any) => boolean);
  hasView?: boolean | ((item: any) => boolean);
  hasOptions?: boolean | ((item: any) => boolean);
};

export type PermissionsType = {
  id?: string;
  roleId?: string;
  name?: string;
} & ActionButtonsType &
  DynamicallyFilledObject<any>;

export type SelectDataType = {
  value: string;
  label: string;
};
