import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";

const DynamicButton = ({
  type,
  setNewInputType,
}: {
  type: string[];
  setNewInputType: Dispatch<SetStateAction<string>>;
}) => {
  const [IsClickAddNew, setIsClickAddNew] = useState(false);

  const handleClickAddNew: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsClickAddNew((prev) => !prev);
    setNewInputType((prev) => "");
  };

  const handleClickType: MouseEventHandler = (e) => {
    e.stopPropagation();
    const target = e.target as HTMLButtonElement;
    if (!target?.id) return;
    setNewInputType((prev) => target.id);
  };
  return (
    <div className="p-4">
      <button onClick={handleClickAddNew}>add New</button>
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
