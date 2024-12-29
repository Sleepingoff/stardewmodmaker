import { Input, Inputs } from "../type/types";

const addValueByParentId = (
  inputs: Inputs,
  parentId: string[],
  newValue: Input,
  position: string
): Inputs => {
  const targetDepth = parentId.length;

  if (targetDepth === 0) {
    const targetPositionIndex = inputs.findIndex(
      (input) => input.id === position
    );
    if (targetPositionIndex === -1) {
      return [...inputs, newValue]; // position이 없을 경우 맨 뒤에 추가
    }
    return [
      ...inputs.slice(0, targetPositionIndex + 1),
      newValue,
      ...inputs.slice(targetPositionIndex + 1),
    ];
  }

  const recursiveUpdate = (items: Inputs, currentDepth: number): Inputs => {
    return items.map((item) => {
      if (item.id === parentId[currentDepth]) {
        if (currentDepth === targetDepth - 1) {
          const targetPositionIndex = Array.isArray(item.value)
            ? item.value.findIndex((child) => child.id === position)
            : -1;

          if (!Array.isArray(item.value)) {
            throw new Error(`Expected an array at depth ${currentDepth}`);
          }

          if (targetPositionIndex === -1) {
            return {
              ...item,
              value: [...item.value, newValue], // position이 없으면 맨 뒤에 추가
            };
          }

          return {
            ...item,
            value: [
              ...item.value.slice(0, targetPositionIndex + 1),
              newValue,
              ...item.value.slice(targetPositionIndex + 1),
            ],
          };
        }

        if (Array.isArray(item.value)) {
          return {
            ...item,
            value: recursiveUpdate(item.value, currentDepth + 1),
          };
        }
      }
      return item; // 일치하지 않는 항목은 그대로 유지
    });
  };

  return recursiveUpdate(inputs, 0);
};

export default addValueByParentId;
