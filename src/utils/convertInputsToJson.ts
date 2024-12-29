import { Field } from "../type/types";

const convertInputsToJson = (inputs: Field[]): Record<string, any> => {
  const recursiveConvert = (items: Field[]): Record<string, any> => {
    return items.reduce((acc, item) => {
      if (item.type === "object") {
        // 객체형 처리
        acc[item.key] = recursiveConvert(item.value);
      } else if (item.type === "array") {
        // 배열형 처리
        acc[item.key] = item.value.map((subItem: Field) =>
          subItem.type === "object" || subItem.type === "array"
            ? recursiveConvert(subItem.value)
            : subItem.defaultValue ?? subItem.value
        );
      } else {
        // 기본 값 처리
        acc[item.key] = item.defaultValue ?? item.value;
      }
      return acc;
    }, {} as Record<string, any>);
  };
  return recursiveConvert(inputs);
};

export default convertInputsToJson;
