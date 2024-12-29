import { Input, Inputs } from "../type/types";

const deleteValueById = (inputs: Inputs, targetValue: Input): Inputs => {
  const targetDepth = targetValue.parentId?.length ?? 0;

  const recursiveUpdate = (items: Inputs, currentDepth: number): Inputs => {
    return items
      .filter((item) => !(item.id === targetValue.id)) // 조건 만족 시 필터링
      .map((item) => {
        if (Array.isArray(item.value) && currentDepth < targetDepth) {
          return {
            ...item,
            value: recursiveUpdate(item.value, currentDepth + 1),
          };
        }
        return item;
      });
  };

  return recursiveUpdate(inputs, 0);
};

export default deleteValueById;
