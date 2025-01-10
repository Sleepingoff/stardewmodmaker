import { create } from "zustand";
import { Languages } from "./../type/jsonKeys";

interface GlobalStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  Languages: Languages;
  setLanguages: (Languages: Languages) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
  Languages: "ko-KR",
  setLanguages: (Languages) => set({ Languages }),
}));
