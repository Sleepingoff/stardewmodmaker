import { createContext } from "react";
import { ContextValue, InputContextValue } from "../type/context";

export const InputContext = createContext<InputContextValue>({
  value: {},
  setter: null,
});

export const MainContext = createContext<ContextValue>({
  value: "",
  setter: null,
});
