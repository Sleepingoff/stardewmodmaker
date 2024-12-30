import { TemplateType } from "../type/template";
import { GuideType } from "../type/types";
const findKeyInNestedObject = (
  content: Record<string, any>,
  targetKey: string
): any | null => {
  // content.json 전체를 탐색하며 키를 찾음
  for (const [key, value] of Object.entries(content)) {
    if (key === targetKey) {
      return value; // 키를 찾으면 반환
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      const found = findKeyInNestedObject(value, targetKey);
      if (found) return found; // 재귀적으로 탐색
    }
  }
  return null; // 키를 찾지 못한 경우
};
const mergeTemplateWithDefault = (
  template: TemplateType[],
  contentDefinitions: GuideType
): TemplateType[] => {
  return template.map((item) => {
    const contentDefinition = findKeyInNestedObject(
      contentDefinitions,
      item.key
    );
    if (contentDefinition) {
      // 병합
      return {
        ...contentDefinition, // content.json의 값 우선
        ...item, // 사용자가 정의한 값
      };
    }
    // content.json에 없으면 그대로 반환
    return item;
  });
};

export default mergeTemplateWithDefault;
