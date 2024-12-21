import { useContext, useEffect, useState } from "react";
import { Inputs } from "../../type/types";
import { FormatContext, InputContext } from "../../hooks/context";
import FormatValue from "../FormatValue";
import convertInputsToJson from "../../utils/convertInputsToJson";

interface NewTabType {
  id: string;
}
const NewTab = ({ id }: NewTabType) => {
  const { setter } = useContext(InputContext);
  const [inputs, setInputs] = useState<Inputs>([
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
    const jsonOutput = convertInputsToJson(inputs);
    setter((prev) => ({
      ...prev,
      [id]: jsonOutput,
    }));
  }, [inputs, setter]);

  return (
    <section key={id + "newTab"}>
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <div className="w-full p-5 pl-0">
          {inputs.map((input) => (
            <FormatValue
              key={input.id + "format"}
              inputs={input}
              separator=","
            />
          ))}
        </div>
      </FormatContext.Provider>
    </section>
  );
};

export default NewTab;
