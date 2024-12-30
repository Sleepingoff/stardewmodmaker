import mergeTemplateWithDefault from "../../utils/mergeTemplateWithDefault";
import * as ContentGuide from "../../assets/content.json";
import addUniqueId from "../../utils/addUniqueId";
import { FormatContext, InputContext } from "../../hooks/context";
import DynamicButton from "../DynamicButton";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import generateNewInput from "../../utils/generateNewInput";
import { Inputs } from "../../type/types";
import FormatValue from "../FormatValue";

const TempTab = ({ id, temp }: { id: string; temp: any }) => {
  const { value, setter } = useContext(InputContext);
  const template = mergeTemplateWithDefault(
    value[id] ? value[id] : temp.content.template,
    ContentGuide
  );

  const guide = addUniqueId({
    InitialRequired: [],
    locales: { "ko-KR": template },
  });

  const [inputs, setInputs] = useState<Inputs>(guide.locales["ko-KR"]);
  useEffect(() => {
    if (!setter) return;
    setter((prev) => ({
      ...prev,
      [id]: inputs,
    }));
  }, [inputs, setter]);
  const handleClickTypes =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const newInputs = generateNewInput(type, inputs);
      setInputs((prev) => [newInputs, ...prev]);
    };

  return (
    <section key={id + "newTab"}>
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <div className="w-[40vw] p-5 pl-0">
          <DynamicButton
            type={["log", "text", "object", "array"]}
            handleClickTypes={handleClickTypes}
          />
          {inputs.map((input) => (
            <FormatValue key={input.id} inputs={input} separator="," />
          ))}
        </div>
      </FormatContext.Provider>
    </section>
  );
};

export default TempTab;
