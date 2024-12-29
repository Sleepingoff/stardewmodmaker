import { v4 as uuidv4 } from "uuid"; // UUID를 생성하기 위한 패키지
import { Field, GuideType, IdField, IdGuidType } from "../type/types";

const addUniqueId = <T extends GuideType>(data: T): IdGuidType => {
  const processFields = (
    fields: Field[],
    parentIds: string[] = []
  ): IdField[] => {
    return fields.map((field) => {
      if (
        typeof field === "object" &&
        !Array.isArray(field) &&
        "type" in field
      ) {
        const id = uuidv4(); // 고유 ID 생성
        const updatedField = {
          ...field,
          id,
          parentId: [...parentIds],
        } as IdField;

        // 재귀적으로 중첩된 value 처리
        if (Array.isArray(field.value)) {
          updatedField.value = processFields(field.value, [...parentIds, id]);
        }

        return updatedField;
      } else {
        throw new Error("Invalid field format detected.");
      }
    });
  };

  const updatedManifest: IdGuidType = {
    InitialRequired: [...data.InitialRequired],
    locales: {},
  };

  Object.entries(data.locales).forEach(([locale, fields]) => {
    if (!Array.isArray(fields)) {
      throw new Error(`Expected an array of fields for locale ${locale}`);
    }

    updatedManifest.locales[locale] = processFields(fields as Field[], []);
  });

  return updatedManifest;
};

export default addUniqueId;
