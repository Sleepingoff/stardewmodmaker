import React, {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  GoCheckbox,
  GoLog,
  GoNumber,
  GoPencil,
  GoPlusCircle,
} from "react-icons/go";

const DynamicButton = ({
  type,
  text,
  open = false,
  handleClickTypes,
}: {
  type: string[];
  handleClickTypes: (type: string) => MouseEventHandler;
  text?: string;
  open?: boolean;
}) => {
  const [IsClickAddNew, setIsClickAddNew] = useState(false);

  const handleClickAddNew: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsClickAddNew((prev) => !prev);
  };
  return (
    <div className={`relative ml-auto mr-0 ${open ? "flex " : "flex-col"} `}>
      {IsClickAddNew && (
        <label
          //open이 true일 때는 flex, 위으 버튼 왼쪽으로 정렬. false일 때는 flex-col
          className={` ${
            open
              ? "flex justify-end"
              : "flex-col absolute top-8 right-0 z-10 justify-center align-center"
          } button-container min-w-[5rem]`}
        >
          {type.map((t) => (
            <button
              id={t}
              key={t}
              onClick={handleClickTypes(t)}
              className="w-full max-w-[5rem] bg-gray-50 px-2"
            >
              {t == "log" ? (
                <span className="">
                  {" "}
                  <GoLog className="inline" />{" "}
                  <span className="text-sm"> Log</span>
                </span>
              ) : t == "array" ? (
                <span className="">
                  {"["} {"]"}
                  <span className="text-sm"> Array</span>
                </span>
              ) : t == "object" ? (
                <span className="">
                  {"{"} {"}"}
                  <span className="text-sm"> Object</span>
                </span>
              ) : t == "text" ? (
                <span className="">
                  {" "}
                  <GoPencil className="inline" />{" "}
                  <span className="text-sm"> Text</span>
                </span>
              ) : t == "number" ? (
                <span className="">
                  {" "}
                  <GoNumber className="inline" />{" "}
                  <span className="text-sm"> Num</span>
                </span>
              ) : t == "checkbox" ? (
                <span className="">
                  {" "}
                  <GoCheckbox className="inline" />{" "}
                  <span className="text-sm"> T/F</span>
                </span>
              ) : (
                t
              )}
            </button>
          ))}
        </label>
      )}
      <button onClick={handleClickAddNew} className="bg-gray-50 px-2">
        {text ?? (
          <span>
            <GoPlusCircle className="inline" />{" "}
            <span className="text-sm">ADD</span>
          </span>
        )}
      </button>
    </div>
  );
};

export default DynamicButton;
