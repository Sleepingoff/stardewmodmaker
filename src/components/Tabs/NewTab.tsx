import { useContext, useEffect, useState } from "react";
import { Inputs } from "../../type/types";
import { FormatContext, InputContext } from "../../hooks/context";
import FormatValue from "../FormatValue";
import * as ContentGuide from "../../assets/content.json";
import addUniqueId from "../../utils/addUniqueId";
const guide = addUniqueId(ContentGuide);
interface NewTabType {
  id: string;
}
const NewTab = ({ id }: NewTabType) => {
  const { setter } = useContext(InputContext);
  const [inputs, setInputs] = useState<Inputs>(guide.locales["ko-KR"]);

  useEffect(() => {
    if (!setter) return;
    setter((prev) => ({
      ...prev,
      [id]: inputs,
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
