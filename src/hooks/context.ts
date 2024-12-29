import { createContext } from "react";
import {
  ContextValue,
  FormatContextValue,
  InputContextValue,
} from "../type/context";

export const InputContext = createContext<InputContextValue>({
  value: { InitialRequired: [] },
  setter: null,
});

export const MainContext = createContext<ContextValue>({
  value: [],
  setter: null,
});

export const FormatContext = createContext<FormatContextValue>({
  value: [],
  setter: null,
});
