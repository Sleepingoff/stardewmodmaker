import { v4 as uuidv4 } from "uuid"; // UUID를 생성하기 위한 패키지
import { IdField, Input, Inputs } from "../type/types";
let count = 0;
const generateNewInput = (type: string, inputs: Input | Inputs): Input => {
  count += Math.floor(Math.random() * 1000);
  const newId = uuidv4();
  if (Array.isArray(inputs)) {
    let newInputs: IdField = {
      id: newId,
      key: "new Key" + count,
      value: [
        {
          id: uuidv4(),
          key: "new Key in" + count,
          value: [],
          type: "text",
          defaultValue: " ",
          parentId: [newId],
          template: [],
        },
      ],
      type: type,
      parentId: [],
      template: [],
    };

    if (type == "text") {
      newInputs = {
        id: newId,
        key: "new Key" + count,
        value: [],
        type: type,
        defaultValue: " ",
        parentId: [],
        template: [],
      };
    }
    if (type == "log") {
      newInputs = {
        id: newId,
        key: "LogName",
        value: [],
        type: type,
        defaultValue: "new Log",
        parentId: [],
        template: [],
        description:
          "중복된 LogName이 있을 경우 첫번째 LogName만 json에 표시됩니다.",
      };
    }

    return newInputs;
  }

  let newInputs: IdField = {
    id: newId,
    key: "new Key" + count,
    value: [
      {
        id: uuidv4(),
        key: "new Key in" + count,
        value: [],
        type: "text",
        defaultValue: " ",
        parentId: [...inputs.parentId, newId],
        template: [],
      },
    ],
    type: type,
    parentId: inputs.parentId,
    template: [],
  };

  if (type == "text") {
    newInputs = {
      id: newId,
      key: "new Key" + count,
      value: [],
      type: type,
      defaultValue: " ",
      parentId: inputs.parentId,
      template: [],
    };
  }
  if (type == "log") {
    newInputs = {
      id: newId,
      key: "LogName",
      value: [],
      type: type,
      defaultValue: "new Log",
      parentId: inputs.parentId,
      template: [],
    };
  }
  if (type == "checkbox") {
    newInputs = {
      id: newId,
      key: "new Key" + count,
      value: [],
      type: type,
      defaultValue: false,
      parentId: inputs.parentId,
      template: [],
    };
  }

  return newInputs;
};
export default generateNewInput;
