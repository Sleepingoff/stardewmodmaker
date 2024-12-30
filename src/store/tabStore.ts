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
  setActiveTab: (tab: string) => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: ["0", "1"],
      templates: [],
      activeTab: "0",
      setTabs: (tabs) => set({ tabs }),
      setTemplates: (updater) =>
        set((state) => ({ templates: updater(state) })),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    { name: "tab-storage" } // 로컬 스토리지 키 이름
  )
);
