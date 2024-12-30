import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InputValue = {
  [key: string]: object;
};

interface InputStore {
  inputs: InputValue;
  setInputs: (
    updater: InputValue | ((prevState: InputValue) => InputValue)
  ) => void;
  initializeInputs: (keys: string[]) => void;
}

export const useInputStore = create<InputStore>()(
  persist(
    (set) => ({
      inputs: {},

      // Zustand 상태 업데이트
      setInputs: (updater) =>
        set((state) => ({
          inputs:
            typeof updater === "function"
              ? updater(state.inputs)
              : { ...state.inputs, ...updater },
        })),

      // 초기화 로직
      initializeInputs: (keys) =>
        set((state) => {
          const newInputs = { ...state.inputs };
          keys.forEach((key) => {
            if (!newInputs[key]) newInputs[key] = [];
          });
          return { inputs: newInputs };
        }),
    }),
    { name: "input-storage" }
  )
);
