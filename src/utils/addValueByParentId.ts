import { Input, Inputs } from "../type/types";

const addValueByParentId = (
  inputs: Inputs,
  parentId: number[],
  newValue: Input,
  position?: number
): Inputs => {
  const targetDepth = parentId.length - 1;

  const recursiveUpdate = (items: Inputs, currentDepth: number): Inputs => {
    return items.map((item) => {
      if (
        item.parentId.length === targetDepth &&
        item.parentId.every((id, i) => id === parentId[i])
      ) {
        // 현재 depth에서 parentId가 일치하면 value를 업데이트
        if (!!position) {
          return {
            ...item,
            value: [
              ...item.value.splice(0, position + 1),
              newValue,
              ...item.value,
            ],
          };
        } else
          return {
            ...item,
            value: [...item.value, newValue],
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

export default addValueByParentId;
