import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import DynamicButton from "../DynamicButton";
import { FormatKey, FormatValue } from "../FormatValue";

type Types = Array<string | Types>;

const ContentTab = () => {
  const [types, setTypes] = useState<Types>(["text", "array"]);
  //훅
  const [inputs, setInputs] = useState<Types>(["Format", "Changes"]);

  return (
    <section>
      <FormatKey
        types={types}
        beforeInputs="{"
        afterInputs="}"
        separator=","
        inputs={inputs}
      />
    </section>
  );
};

export default ContentTab;
