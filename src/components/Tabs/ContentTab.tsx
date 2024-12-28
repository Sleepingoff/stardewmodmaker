import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormatContext, InputContext } from "../../hooks/context";
import { Input, Inputs } from "../../type/types";
import FormatValue from "../FormatValue";
import convertInputsToJson from "../../utils/convertInputsToJson";

const ContentTab = () => {
  const { setter } = useContext(InputContext);

  //훅
  const [inputs, setInputs] = useState<Inputs>([
    {
      key: "Format",
      id: 0,
      parentId: [],
      value: [],
      type: "text",
      defaultValue: "2.4.0",
    },
    {
      key: "Changes",
      parentId: [],
      value: [
        {
          id: 2,
          key: "0",
          parentId: [1],
          value: [
            {
              id: 3,
              parentId: [1, 2],
              key: "Actions",
              value: [],
              defaultValue: "Load",
              type: "text",
            },
          ],
          type: "object",
        },
      ],
      id: 1,
      type: "array",
    },
  ]);
  useEffect(() => {
    if (!setter) return;

    setter((prev) => ({
      ...prev,
      1: inputs,
    }));
  }, [inputs, setter]);
  return (
    <section>
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <div className="w-full p-5 pl-0">
          {inputs.map((input) => (
            <FormatValue key={input.id} inputs={input} separator="," />
          ))}
        </div>
      </FormatContext.Provider>
    </section>
  );
};

export default ContentTab;
