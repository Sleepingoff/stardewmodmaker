import { useContext } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MainContext } from "../hooks/context";

const JsonPreviewSection = () => {
  const { value } = useContext(MainContext);
  return (
    <section className=" p-6 bg-gray-50 w-6/12 shrink-0	h-full">
      <h2 className="text-lg font-semibold mb-4">JSON Preview</h2>
      <SyntaxHighlighter language="json" style={vscDarkPlus}>
        {`{${value}}`}
      </SyntaxHighlighter>
    </section>
  );
};

export default JsonPreviewSection;
