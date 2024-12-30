export type TemplateType = {
  key: string; // 템플릿 키
  value: TemplateType[]; // 템플릿 값 (다양한 값이 들어갈 수 있음)
  type: string; // 템플릿 타입
  template?: TemplateType[]; // 중첩된 템플릿
  defaultValue?: string | number | boolean; // 기본값
  description?: string; // 설명 (선택적)
  placeholder?: string; // 입력란에 표시할 기본 문구 (선택적)
  inputType?: string; // 입력 유형
  availableValues?: string[]; // 선택 가능한 값 목록 (선택적)
  availableTypes?: string[];
  separator?: string; // 구분자 (선택적)
  tooltipForAdditionalExplanation?: string; // 추가 설명 툴팁 (선택적)
  requireAllKeys?: boolean; // 모든 키가 필수인지 여부
};

export type InitialRequiredType = {
  InitialRequired: string[]; // 필수 필드 목록
  template: TemplateType; // 템플릿 정의
};
