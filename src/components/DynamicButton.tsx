import React, {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { NewType } from "../type/types";

const DynamicButton = ({
  type,
  text,
  handleClickTypes,
}: {
  type: string[];
  handleClickTypes: (type: string) => MouseEventHandler;
  text?: string;
}) => {
  const [IsClickAddNew, setIsClickAddNew] = useState(false);

  const handleClickAddNew: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsClickAddNew((prev) => !prev);
  };
  return (
    <div className="dynamic">
      <button onClick={handleClickAddNew}>{text ?? <span>➕</span>}</button>
      {IsClickAddNew && (
        <label className="flex flex-col	">
          {type.map((t) => (
            <button id={t} key={t} onClick={handleClickTypes(t)}>
              {t == "log"
                ? "✏️"
                : t == "array"
                ? "[ ]"
                : t == "object"
                ? "{ }"
                : t == "text"
                ? "TEXT"
                : t == "number"
                ? "123"
                : t == "checkbox"
                ? "T/F"
                : t}
            </button>
          ))}
        </label>
      )}
    </div>
  );
};

export default DynamicButton;
