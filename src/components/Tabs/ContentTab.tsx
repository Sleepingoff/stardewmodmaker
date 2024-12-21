import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import DynamicButton from "../DynamicButton";
import FormatStart from "../FormatValue";
import { FormatContext, InputContext } from "../../hooks/context";
import { Input, Inputs, Types } from "../../type/types";

const ContentTab = () => {
  const { setter } = useContext(InputContext);

  //훅
  const [inputs, setInputs] = useState<Inputs>([
    {
      key: "Format",
      id: 0,
      value: [],
      type: ["text"],
      defaultValue: "2.4.0",
    },
    {
      key: "Changes",
      value: [
        {
          id: 2,
          key: "0",
          value: [
            {
              id: 3,
              key: "Actions",
              value: [],
              defaultValue: "Load",
              type: ["text"],
            },
          ],
          type: ["object"],
        },
      ],
      id: 1,
      type: ["array"],
    },
  ]);
  //   useEffect(() => {
  //     if (!setter) return;

  //     setter((prev) => ({
  //       ...prev,
  //       content: inputs,
  //     }));
  //   }, [inputs, setter]);
  const [type, setType] = useState<Types>(
    inputs.map((v: Input) => v.type).flat()
  );

  return (
    <section>
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <FormatStart separator="," inputs={inputs} />
      </FormatContext.Provider>
    </section>
  );
};

export default ContentTab;
