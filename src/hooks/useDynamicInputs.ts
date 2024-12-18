import { useState } from "react";

type InputType = "text" | "array" | "object";

interface TextInput {
  type: "text";
  id: string;
  value: string;
}

interface ArrayInput {
  type: "array";
  id: string;
  values: string[];
}

interface ObjectInput {
  type: "object";
  id: string;
  pairs: { key: string; value: string }[];
}
type InputItem = TextInput | ArrayInput | ObjectInput;

export const useDynamicInputs = () => {
  const [inputs, setInputs] = useState<InputItem[]>([]);

  // 타입 가드 함수
  const isTextInput = (input: InputItem): input is TextInput =>
    input.type === "text";
  const isArrayInput = (input: InputItem): input is ArrayInput =>
    input.type === "array";
  const isObjectInput = (input: InputItem): input is ObjectInput =>
    input.type === "object";

  const addInput = (type: InputType) => {
    const newInput: InputItem =
      type === "text"
        ? { type: "text", id: crypto.randomUUID(), value: "" }
        : type === "array"
        ? { type: "array", id: crypto.randomUUID(), values: [""] }
        : {
            type: "object",
            id: crypto.randomUUID(),
            pairs: [{ key: "", value: "" }],
          };

    setInputs((prev) => [...prev, newInput]);
  };

  const updateInput = (
    id: string,
    updatedValues: Partial<TextInput | ArrayInput | ObjectInput>
  ) => {
    setInputs((prev) =>
      prev.map((input) => {
        if (input.id !== id) return input;

        if (isTextInput(input) && "value" in updatedValues) {
          return { ...input, value: updatedValues.value! };
        }

        if (isArrayInput(input) && "values" in updatedValues) {
          return { ...input, values: updatedValues.values! };
        }

        if (isObjectInput(input) && "pairs" in updatedValues) {
          return { ...input, pairs: updatedValues.pairs! };
        }

        return input; // 변경 사항이 없으면 기존 상태 반환
      })
    );
  };

  const removeInput = (id: string) => {
    setInputs((prev) => prev.filter((input) => input.id !== id));
  };

  return { inputs, addInput, updateInput, removeInput };
};
