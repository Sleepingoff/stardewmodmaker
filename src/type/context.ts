import { Dispatch, SetStateAction } from "react";
export type ContextValue = {
  value: string;
  setter: Dispatch<SetStateAction<string>> | null;
};

export type InputContextValue = {
  value: {
    [key: string]: object;
  };
  setter: Dispatch<SetStateAction<InputValue>> | null;
};

export type InputValue = {
  [key: string]: object;
};

export type FormatContextValue = {
  [key: string]: FormatContextValue | any;
};
