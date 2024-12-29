import { v4 as uuidv4 } from "uuid"; // UUID를 생성하기 위한 패키지
import { Input } from "../type/types";

const generateNewInput = (type: string, inputs: Input): Input => {
  const newId = uuidv4();
  const newInputs =
    type == "text"
      ? {
          id: newId,
          key: "new Key" + newId,
          value: [],
          type: type,
          defaultValue: " ",
          parentId: inputs.parentId,
          template: [],
        }
      : {
          id: newId,
          key: "new Key" + newId,
          value: [
            {
              id: uuidv4(),
              key: "new Key in" + newId,
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

  return newInputs;
};
export default generateNewInput;
