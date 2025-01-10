//각 키의 스크롤 위치를 기억하는 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Input } from "../type/types";

//탭별로 스크롤 위치를 기억
interface ScrollState {
  scroll: { [key: string]: { [key: number]: Input } };
  setScroll: (tab: string, key: number, value: Input) => void;
  deleteScroll: (tab: string, key: number) => void;
  resetScroll: () => void;
}

export const useScrollStore = create<ScrollState>()(
  persist(
    (set) => ({
      scroll: { 0: {} },
      setScroll: (tab, key, value) =>
        set((state) => ({
          scroll: {
            ...state.scroll, // 기존 전체 탭 데이터 유지
            [tab]: {
              ...state.scroll[tab], // 현재 탭의 기존 데이터 유지
              [key]: value, // 새로운 데이터 추가
            },
          },
        })),
      deleteScroll: (tab, key) => {
        set((state) => {
          const updatedTabScroll = { ...state.scroll[tab] }; // 현재 탭의 스크롤 데이터 복사
          delete updatedTabScroll[key]; // 키 삭제

          return {
            scroll: {
              ...state.scroll, // 기존 상태 복사
              [tab]: updatedTabScroll, // 수정된 탭 데이터 갱신
            },
          };
        });
      },
      resetScroll: () => set({ scroll: {} }),
    }),
    { name: "scroll-storage" }
  )
);
