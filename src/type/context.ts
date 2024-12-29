import { Dispatch, SetStateAction } from "react";
import { Field, Inputs, LocaleGuidType } from "./types";
export type ContextValue = {
  value: Inputs;
  setter: Dispatch<SetStateAction<Inputs>> | null;
};

export type InputContextValue = {
  value: InputValue;
  setter: Dispatch<SetStateAction<InputValue>> | null;
};

export type InputValue = {
  [key: string]: object;
};

export type FormatContextValue = {
  value: Inputs;
  setter: Dispatch<SetStateAction<Inputs>> | null;
};
