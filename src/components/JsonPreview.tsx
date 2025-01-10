import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import convertInputsToJson from "../utils/convertInputsToJson";
import { Inputs } from "../type/types";

const JsonPreview = ({ value }: { value: Inputs }) => {
  const [copy, setCopy] = useState<boolean>(false);

  const handleClickCopy: MouseEventHandler = () => {
    navigator.clipboard.writeText(
      JSON.stringify(convertInputsToJson(value), null, "\t")
    );
    setCopy(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  }, [copy]);
  return (
    <section className="w-[30vw] shrink absolute z-10 preview over">
      <button className="absolute right-2 top-5" onClick={handleClickCopy}>
        {copy ? "copied!" : "copy"}
      </button>
      <SyntaxHighlighter
        language="json"
        style={vscDarkPlus}
        wrapLines={true}
        wrapLongLines={true}
        showLineNumbers={true}
        className="w-full highlight"
      >
        {JSON.stringify(convertInputsToJson(value), null, "\t")}
      </SyntaxHighlighter>
    </section>
  );
};
export default JsonPreview;
