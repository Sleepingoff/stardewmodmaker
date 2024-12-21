export type Inputs = Array<Input>;
export type Input = {
  id: number;
  parentId: number[];
  type: string;
  value: Inputs;
  key: string;
  defaultValue?: string;
};
export type Value = Input | Inputs;
export type NewType = { [key: string]: string | number };
