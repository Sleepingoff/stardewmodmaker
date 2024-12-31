import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MainContext } from "../hooks/context";
import convertInputsToJson from "../utils/convertInputsToJson";

const JsonPreviewSection = ({
  currentScrollLine,
}: {
  currentScrollLine?: number;
}) => {
  const { value } = useContext(MainContext);

  const [copy, setCopy] = useState<boolean>(false);

  const handleClickCopy: MouseEventHandler = () => {
    navigator.clipboard.writeText(JSON.stringify(value, null, "\t"));
    setCopy(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  }, [copy]);
  return (
    <section className="w-full shrink h-[80vh] relative">
      <button className="absolute right-2 top-5" onClick={handleClickCopy}>
        {copy ? "copied!" : "copy"}
      </button>
      {value && (
        <SyntaxHighlighter
          language="json"
          style={vscDarkPlus}
          wrapLines={true}
          showLineNumbers={true}
          lineProps={(lineNumber) => {
            const style: any = { display: "block", width: "fit-content" };
            if (currentScrollLine && currentScrollLine == lineNumber) {
              style.backgroundColor = "#FFDB81";
            }
            return { style };
          }}
        >
          {JSON.stringify(convertInputsToJson(value), null, "\t")}
        </SyntaxHighlighter>
      )}
    </section>
  );
};

export default JsonPreviewSection;
