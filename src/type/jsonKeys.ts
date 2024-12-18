type defaultValueType = string | number | [] | object | boolean;
type JsonType = "text" | "number" | "array" | "object" | "boolean";

export interface Languages {
  "ko-KR": any;
}

interface JsonKeys {
  //필수로 입력해야할 키값들.
  InitialRequired: string[];

  //사용자에게 도움을 주기 위한 툴팁 내용
  tooltipForAdditionalExplanation: string;

  //사용자가 입력할 때 input에 나타날 대체 텍스트
  placeholder: string;

  //최종 json 파일 형식
  type: JsonType | JsonType[];

  //사용자에게 입력을 받을 때 표시할 방법
  /**
   * select: 여러 값 중에 사용자가 선택하기
   * 키가 없을 때 : type 자체가 inputType이 됨.
   */
  inputType?: "select";

  //처음에 json에 기본적으로 표시되는 값.
  defaultValue: defaultValueType;

  //inputType이 select인 경우, 선택이 가능한 값
  availableValues: [
    | string
    | {
        //하위 선택 옵션 또는 직접 입력 기능 제공
        [key: string]: JsonKeys;
      }
  ];

  //availableValues의 하위 선택 옵션 제공 시 상위옵션 - 하위옵션 간의 구분자
  //ex) "/"인 경우 => "상위옵션/하위옵션"
  separator: string;

  //type이 JsonKey[]인 경우
  //type == array인 경우
  "type==array": JsonKeys;

  //type == object인 경우
  "type==object": JsonKeys;
  //object value의 타입 변경이 가능한지
  convertValueType: boolean;
  //object key를 동적으로 추가할 수 있는지
  availableMultipleKey: boolean;
  //availableValues에 입력한 object key가 모두 필요한지.
  requireAllKeys: boolean;
  //object key에 대한 설정
  key: JsonKeys;
  //object value에 대한 설정 또는 각 키에 대한 세부 value 설정
  value: {
    [key: string]: JsonKeys;
  };
}
export default JsonKeys;
