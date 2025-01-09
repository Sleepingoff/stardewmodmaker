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
import * as ContentGuide from "../../assets/content.json";
import addUniqueId from "../../utils/addUniqueId";
import DynamicButton from "../DynamicButton";
import generateNewInput from "../../utils/generateNewInput";

const guide = addUniqueId(ContentGuide);
const ContentTab = () => {
  const { value, setter } = useContext(InputContext);

  const [inputs, setInputs] = useState<Inputs>(
    value[1] ? (value[1] as Inputs) : guide.locales["ko-KR"]
  );
  useEffect(() => {
    if (!setter) return;

    setter((prev) => ({
      ...prev,
      1: inputs,
    }));
  }, [inputs, setter]);
  const handleClickTypes =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const newInputs = generateNewInput(type, inputs);
      setInputs((prev) => [newInputs, ...prev]);
    };
  return (
    <section>
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <div className="w-[40vw] p-5 pl-0 flex flex-col gap-2">
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

export default ContentTab;
