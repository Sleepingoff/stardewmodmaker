export type Value = Input | Inputs;
export type NewType = { [key: string]: string | number };
export interface Field extends Object {
  key: string;
  type: string;
  value: Field[];
  template?: Field[];
  defaultValue?: string | number | boolean;
  placeholder?: string;
  description?: string;
  tooltipForAdditionalExplanation?: string;
  availableTypes?: string[];
}

export interface LocaleGuidType {
  InitialRequired: string[];
}
export interface GuideType {
  InitialRequired: string[]; // 별도로 정의
  locales: {
    [locale: string]: Field[];
  };
}

export interface IdGuidType {
  InitialRequired: string[]; // 별도로 정의
  locales: {
    [locale: string]: IdField[];
  };
}
export type IdField = IdType & Field;
interface IdType {
  id: string;
  parentId: string[];
  value: IdField[];
  template: IdField[];
}

export type Input = IdField;

export type Inputs = Array<Input>;
