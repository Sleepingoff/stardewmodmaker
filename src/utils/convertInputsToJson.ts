import { Field } from "../type/types";

const convertInputsToJson = (inputs: Field[]): Record<string, any> => {
  const recursiveConvert = (items: Field[]): Record<string, any> => {
    if (!Array.isArray(items)) return items;
    return items.reduce((acc, item) => {
      if (item.type === "object") {
        // 객체형 처리
        acc[item.key] = recursiveConvert(item.value as Field[]);
      } else if (item.type === "array") {
        // 배열형 처리
        acc[item.key] = (item.value as Field[]).map((subItem: Field) =>
          subItem.type === "object" || subItem.type === "array"
            ? recursiveConvert(subItem.value)
            : subItem.defaultValue ?? subItem.value
        );
      } else if (item.type === "log") {
        if (!("LogName" in acc)) {
          acc["LogName"] = item.defaultValue;
        }
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
