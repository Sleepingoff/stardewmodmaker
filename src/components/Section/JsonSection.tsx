import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MainContext } from "../../hooks/context";
import convertInputsToJson from "../../utils/convertInputsToJson";
import { GoDependabot } from "react-icons/go";

const JsonPreviewSection = ({
  currentScrollLine,
}: {
  currentScrollLine?: number;
}) => {
  const { value } = useContext(MainContext);

  const [copy, setCopy] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleClickCopy: MouseEventHandler = () => {
    navigator.clipboard.writeText(
      JSON.stringify(convertInputsToJson(value), null, "\t")
    );
    setCopy(true);
  };
  const handleClickOpenPreview = () => {
    setOpen((prev) => !prev);
  };
  useEffect(() => {
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  }, [copy]);
  return (
    <section className="sticky top-5  h-fit mr-0 ml-auto">
      <button
        onClick={handleClickOpenPreview}
        className="my-2 p-2 bg-gray-800 text-white rounded-md"
      >
        <GoDependabot className="inline" />{" "}
        <span className="text-l">{open ? "CLOSE" : "OPEN"}</span>
      </button>
      {open && (
        <main className="over fixed top-[70vh] right-[10%] w-[60vw] overflow-auto h-[50vh]">
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
        </main>
      )}
    </section>
  );
};

export default JsonPreviewSection;
