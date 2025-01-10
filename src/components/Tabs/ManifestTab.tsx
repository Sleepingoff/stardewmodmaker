import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { FormatContext, InputContext } from "../../hooks/context";
import ManifestGuide from "../../assets/manifest.json";
import FormatValue from "../FormatValue";
import addUniqueId from "../../utils/addUniqueId";
import { Input, Inputs, NewType } from "../../type/types";
import DynamicButton from "../DynamicButton";
import generateNewInput from "../../utils/generateNewInput";

const guide = addUniqueId(ManifestGuide);
const ManifestTab = () => {
  const { value, setter } = useContext(InputContext);

  const [inputs, setInputs] = useState<Inputs>(
    value[0] ? (value[0] as Inputs) : guide.locales["ko-KR"]
  );
  useEffect(() => {
    if (!setter) return;

    setter((prev) => ({
      ...prev,
      0: [...inputs],
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
            open={true}
          />
          {inputs.map((input) => (
            <FormatValue key={input.id} inputs={input} separator="," />
          ))}
        </div>
      </FormatContext.Provider>
    </section>
  );
};

export default ManifestTab;
