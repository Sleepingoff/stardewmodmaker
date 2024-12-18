import { useMemo } from "react";
import JsonKeys, { Languages } from "../type/jsonKeys";

const extractDefaultValue = (field: any) => {
  const type = field?.type;
  switch (type) {
    case "text":
      return field.defaultValue || "";
    case "number":
      return field.defaultValue || 0;
    case "array":
      return field.defaultValue || [];
    case "object": {
      // 객체 내부의 key와 value의 defaultValue를 조합하여 구조 생성
      const keyField = field.defaultValue?.key || {};
      const valueField = field.defaultValue?.value || {};

      if (keyField?.availableValues?.length >= 0) {
        const availableValues: string[] = keyField.availableValues;
        return availableValues.reduce((obj, key) => {
          const keyDefaultValue: string = keyField[key]?.defaultValue || key;
          const valueDefaultValue = extractDefaultValue(valueField[key]);
          obj[keyDefaultValue] = valueDefaultValue;
          return obj;
        }, keyField);
      }

      return {
        [keyField.defaultValue ?? ""]: valueField.defaultValue ?? "",
      };
    }
    default:
      return field.defaultValue || null;
  }
};

const useInitData = <
  T extends Partial<JsonKeys>,
  K extends {
    [key: string]: any;
  }
>(
  jsonData: T
): K => {
  const initData = useMemo(() => {
    const objectKeys = Object.keys(jsonData).filter(
      (key) => key != "InitialRequired"
    );
    return objectKeys.reduce((acc, key) => {
      const field = jsonData[key as keyof T];
      acc[key as keyof K] = extractDefaultValue(field);
      return acc;
    }, {} as K);
  }, [jsonData]);

  return initData as K;
};

export default useInitData;
