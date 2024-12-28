// 기본 Input 타입 정의
export type Input = {
  id: number; // 유니크 ID
  parentId: number[]; // 부모 노드의 ID 목록
  type: string; // 타입 (object, array, string 등)
  value: Inputs; // 자식 Inputs (중첩 구조)
  key: string; // 키 값
  defaultValue?: string; // 기본 값
  [key: string]: any;
};

// Inputs 타입: Input의 배열
export type Inputs = Array<Input>;

// Value 타입: 단일 Input 또는 Input 배열
export type Value = Input | Inputs;

// 변환 중 일부 키-값 매핑을 정의한 타입
export type NewType = { [key: string]: string | number };
