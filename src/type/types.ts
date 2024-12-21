export type Types = Array<string | Types>;
export type Inputs = Array<Input>;
export type Input = {
  id: number;
  type: Types;
  value: Inputs;
  key: string;
  defaultValue?: string;
};
export type Value = Input | Inputs;
export type NewType = { [key: string]: string | number };
