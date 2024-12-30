import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { Inputs } from "../../type/types";
import { FormatContext, InputContext } from "../../hooks/context";
import FormatValue from "../FormatValue";
import * as ContentGuide from "../../assets/content.json";
import addUniqueId from "../../utils/addUniqueId";
import generateNewInput from "../../utils/generateNewInput";
import DynamicButton from "../DynamicButton";
import mergeTemplateWithDefault from "../../utils/mergeTemplateWithDefault";
import { TemplateType } from "../../type/template";

interface NewTabType {
  id: string;
}
const guide = addUniqueId(ContentGuide);
const NewTab = ({ id }: NewTabType) => {
  const { value, setter } = useContext(InputContext);

  const [inputs, setInputs] = useState<Inputs>(
    value[id] ? (value[id] as Inputs) : guide.locales["ko-KR"]
  );

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
            type={["text", "object", "array"]}
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

export default NewTab;
