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
const guide = addUniqueId(ContentGuide);
const ContentTab = () => {
  const { setter } = useContext(InputContext);

  //훅
  const [inputs, setInputs] = useState<Inputs>(guide.locales["ko-KR"]);
  useEffect(() => {
    if (!setter) return;

    setter((prev) => ({
      ...prev,
      1: inputs,
    }));
  }, [inputs, setter]);

  console.log(inputs);
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
