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
    <div className="p-4 ml-auto mr-5 w-fit">
      <button onClick={handleClickAddNew}>{text ?? <span>➕</span>}</button>
      {IsClickAddNew && (
        <>
          {type.map((t) => (
            <button id={t} key={t} onClick={handleClickTypes(t)}>
              {t}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default DynamicButton;
