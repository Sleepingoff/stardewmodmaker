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
    <section className=" p-6 bg-gray-50 w-6/12 shrink-0	h-full">
      <h2 className="text-lg font-semibold mb-4">JSON Preview</h2>
      {copy ? <p>copied!</p> : <button onClick={handleClickCopy}>copy</button>}
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
