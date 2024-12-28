import { Input, Inputs } from "../type/types";

const updateValueById = (inputs: Inputs, newValue: Partial<Input>): Inputs => {
  const targetDepth = newValue.parentId!.length;

  const recursiveUpdate = (items: Inputs, currentDepth: number): Inputs => {
    return items.map((item) => {
      if (item.parentId.length === targetDepth && item.id === newValue.id) {
        return {
          ...item,
          ...newValue,
        };
      }

      if (Array.isArray(item.value) && currentDepth < targetDepth) {
        // value가 배열이고 더 깊은 depth를 탐색해야 할 경우 재귀
        return {
          ...item,
          value: recursiveUpdate(item.value, currentDepth + 1),
        };
      }

      return item; // 일치하지 않으면 원본 유지
    });
  };

  return recursiveUpdate(inputs, 0);
};

export default updateValueById;
