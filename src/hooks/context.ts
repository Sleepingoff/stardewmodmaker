import { createContext, Dispatch, SetStateAction } from "react";

export const InputContext = createContext<string | null>(null);
type ContextValue = {
  value: string;
  setter: Dispatch<SetStateAction<string>> | null;
};
export const MainContext = createContext<ContextValue>({
  value: "",
  setter: null,
});
