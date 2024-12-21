import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import { NewType } from "../type/types";

const DynamicButton = ({
  id,
  type,
  setNewInputType,
}: {
  id: number;
  type: string[];
  setNewInputType: Dispatch<SetStateAction<NewType>>;
}) => {
  const [IsClickAddNew, setIsClickAddNew] = useState(false);

  const handleClickAddNew: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsClickAddNew((prev) => !prev);
    setNewInputType((prev) => ({ target: "", id }));
  };

  const handleClickType: MouseEventHandler = (e) => {
    e.stopPropagation();
    const target = e.target as HTMLButtonElement;
    if (!target?.id) return;
    setNewInputType((prev) => ({ target: target.id, id }));
  };
  return (
    <div className="p-4 ml-auto mr-5 w-fit">
      <button onClick={handleClickAddNew}>➕</button>
      {IsClickAddNew && (
        <>
          {type.map((t) => (
            <button id={t} key={t} onClick={handleClickType}>
              {t}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default DynamicButton;
