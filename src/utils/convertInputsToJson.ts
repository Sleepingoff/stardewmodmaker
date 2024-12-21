import { Input, Inputs } from "../type/types";

const convertInputsToJson = (inputs: Inputs): any => {
  const recursiveConvert = (items: Inputs): any => {
    return items.reduce((acc, item) => {
      if (item.type.includes("object")) {
        acc[item.key] = recursiveConvert(item.value); // 객체형 처리
      } else if (item.type.includes("array")) {
        acc[item.key] = item.value.map((subItem: Input) =>
          subItem.type.includes("object") || subItem.type.includes("array")
            ? recursiveConvert(subItem.value) // 배열은 키를 무시하고 요소만 변환
            : subItem.defaultValue || subItem.value
        );
      } else {
        acc[item.key] = item.defaultValue || item.value; // 기본 값 처리
      }
      return acc;
    }, {} as Input);
  };
  return recursiveConvert(inputs);
};

export default convertInputsToJson;
