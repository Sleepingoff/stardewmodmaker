import { Input, Inputs } from "../type/types";

const convertInputsToJson = (inputs: Inputs): Input => {
  const recursiveConvert = (items: Inputs): Input => {
    return items.reduce((acc, item) => {
      if (item.type.includes("object")) {
        // 객체형 처리
        acc[item.key] = recursiveConvert(item.value);
      } else if (item.type.includes("array") && Array.isArray(item.value)) {
        // 배열형 처리
        acc[item.key] = item.value.map((subItem: Input) =>
          subItem.type.includes("object") || subItem.type.includes("array")
            ? recursiveConvert(subItem.value)
            : subItem.defaultValue || subItem.value
        );
      } else {
        // 기본 값 처리
        acc[item.key] = item.defaultValue || item.value;
      }
      return acc;
    }, {} as Input);
  };

  return recursiveConvert(inputs);
};

export default convertInputsToJson;
