import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TemplateType } from "../type/template";

export interface Template {
  fileName: string;
  content: TemplateType;
}

interface TabState {
  tabs: string[];
  templates: Template[];
  activeTab: string;
  setTabs: (tabs: string[]) => void;
  setTemplates: (
    updater: (state: { templates: Template[] }) => Template[]
  ) => void;
  setActiveTab: (id: string) => void;
  resetStore: () => void;
  initialStore: () => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: ["manifest", "content"],
      templates: [],
      activeTab: "0",
      setTabs: (tabs) => set({ tabs }),
      setTemplates: (updater) =>
        set((state) => ({ templates: updater(state) })),
      setActiveTab: (id) => set({ activeTab: id }),
      resetStore: () => set({ tabs: [], templates: [], activeTab: "0" }),
      initialStore: () => set({ tabs: ["manifest", "content"], templates: [] }),
    }),
    { name: "tab-storage" } // 로컬 스토리지 키 이름
  )
);
