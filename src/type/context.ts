import { Dispatch, SetStateAction } from "react";
import { Inputs } from "./types";
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
  value: Inputs;
  setter: Dispatch<SetStateAction<Inputs>> | null;
};
