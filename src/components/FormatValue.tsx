import {
  ChangeEventHandler,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import DynamicButton from "./DynamicButton";
import { FormatContext } from "../hooks/context";
import { Input, Inputs, NewType } from "../type/types";
import { FormatContextValue } from "../type/context";
import addValueByParentId from "../utils/addValueByParentId";
import updateValueById from "../utils/updateValueById";
interface FormatType {
  separator: string;
  beforeInputs?: string;
  afterInputs?: string;
  inputs: Input;
  disabled?: boolean;
  position?: number;
}

const randomTextValueOnDisabledInput = (): string => {
  const randomTextArray = ["Go!!", "Need No! Key"];
  const randomIndex = Math.floor(Math.random() * randomTextArray.length);
  return randomTextArray[randomIndex] ?? "❤️";
};

const FormatValue = ({
  beforeInputs,
  afterInputs,
  disabled,
  inputs,
  position,
}: FormatType) => {
  const { value, setter }: FormatContextValue = useContext(FormatContext);
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };
  const [currentInputs, setCurrentInputs] = useState<Inputs>(inputs!.value);
  const [parentId, setParentId] = useState<number[]>(inputs.parentId);

  const [type, setNewInputType] = useState<NewType>({
    target: "",
    id: "",
  });
  useEffect(() => {
    if (!type.target) return;
    const newType = type.target as string;
    const newId = (inputs.id + new Date().getSeconds()) * 100;
    const newInputs =
      type.target == "text"
        ? {
            id: newId,
            key: newId + "",
            value: [],
            type: newType,
            defaultValue: " ",
            parentId: parentId,
          }
        : {
            id: newId,
            key: newId + "",
            value: [
              {
                id: newId * 10,
                key: newId * 10 + "",
                value: [],
                type: "text",
                defaultValue: " ",
                parentId: [...parentId, newId],
              },
            ],
            type: newType,
            parentId: parentId,
          };

    // addInputs((prev) => {
    //   return [...prev, newInputs];
    // });
    setNewInputType((prev) => ({ ...prev, target: "" }));
    if (!setter) return;
    const addPosition = position
      ? currentInputs.findIndex((inp) => inp.id == position)
      : currentInputs.length;
    if (parentId.length == 0) {
      setter((prev: Inputs) =>
        addPosition != -1
          ? [...prev.splice(0, addPosition + 1), newInputs, ...prev]
          : [...prev, newInputs]
      );
    } else {
      setter((prev) => [
        ...addValueByParentId(prev, parentId, newInputs, addPosition),
      ]);
    }
  }, [type]);

  useEffect(() => {
    //!inputs 상태 변경 인식을 잘 못하는 문제때문에 작성
    //복사되는 깊이 문제인듯?
    setCurrentInputs(inputs.value || []);
  }, [inputs]);

  //inputs: 부모 객체 or 추가한 객체
  //currentInputs: inputs.value 즉 자식 배열
  //currentInputs 수정 -> inputs.value 수정
  //addInputs: 부모 객체가 속한 자식 배열 수정

  const [key, setKey] = useState<string>(
    disabled ? randomTextValueOnDisabledInput() : inputs.key ?? ""
  );
  return (
    <div
      key={inputs.id + (inputs.type[0] as string)}
      id={inputs.id + ""}
      className=""
    >
      {!inputs?.defaultValue ? (
        <div className="w-full">
          <details open>
            {/* {beforeInputs} */}
            <summary className={inputs.type}>
              <input
                type="text"
                value={key}
                disabled={disabled}
                onChange={(e) => setKey(e.target.value)}
              />
              <button id="" onClick={handleDeleteKey}>
                ❌
              </button>
            </summary>
            {currentInputs.map((input, idx) => {
              return (
                <FormatValue
                  key={idx + inputs.type + input.id}
                  position={input.id}
                  disabled={inputs.type == "array"}
                  separator={","}
                  beforeInputs={
                    idx == 0 ? (inputs.type == "array" ? "[" : "{") : ""
                  }
                  afterInputs={
                    idx == currentInputs.length - 1
                      ? inputs.type == "array"
                        ? "]"
                        : "}"
                      : ""
                  }
                  inputs={input}
                />
              );
            })}
          </details>
        </div>
      ) : (
        <Format input={inputs} disabled={inputs.type == "array"} />
      )}

      <DynamicButton
        id={inputs.id}
        position={position ?? 0}
        type={["text", "object", "array"]}
        setNewInputType={setNewInputType}
      />
      {/* {afterInputs} */}
    </div>
  );
};

const Format = ({ input, disabled }: { input: Input; disabled?: boolean }) => {
  const { setter } = useContext(FormatContext);
  const [key, setKey] = useState<string>(input.key);
  const [sep, setSep] = useState<string>("");
  const [id, setId] = useState<string>("");

  const defaultValue = input.defaultValue?.split(sep);
  const [value, setValue] = useState<{
    [x: string]: string;
  }>(sep ? Object(defaultValue) : { 0: input.defaultValue ?? "" });

  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };
  const handleDeleteText: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };
  const handleChangeSep: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setSep(target.value);
  };
  const handleClickAddSeparator: MouseEventHandler = () => {
    const lastIndex = Object.values(value).length;
    setValue((prev) => ({
      ...prev,
      [lastIndex]: "",
    }));
  };

  useEffect(() => {
    if (!setter) return;
    const currentValue = (sep ?? "") + Object.values(value).join(sep ?? "");
    const newValue = {
      key: key,
      defaultValue: currentValue,
      parentId: input.parentId,
      id: input.id,
    };
    setter((prev) => [...updateValueById(prev, newValue)]);
  }, [value, key, sep]);

  const handleChangeInputs: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target as HTMLTextAreaElement;
    setId((prev) => target.id);
    setValue((prev) => ({
      ...prev,
      [target.id]: target.value,
    }));
  };

  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;
    const textareaElement = textRef.current as HTMLTextAreaElement;
    textareaElement.style.height = `${textareaElement.scrollHeight}px`;
  }, [value]);

  return (
    <div
      className="w-full"
      id={input.id + ""}
      key={input.id + "text" + "container"}
    >
      <details open>
        <summary className="text">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={disabled}
          />
          <label className="flex">
            separator:
            <input
              className="ml-0.5"
              onChange={handleChangeSep}
              value={sep}
              placeholder="input separator"
            />
          </label>
          <button id="" onClick={handleDeleteKey} className="shrink-0">
            ❌ delete all
          </button>
        </summary>{" "}
        {Object.values(value).map((inp, idx) => {
          return (
            <div
              key={"text" + idx + input.id}
              className="w-full flex flex-wrap"
            >
              <div className="flex w-full mt-0.5 shrink-0">
                <span className=" bg-slate-200 rounded-md py-0.5 px-2 mr-0.5">
                  {!!sep ? sep : " "}
                </span>
                <textarea
                  ref={textRef}
                  id={idx + ""}
                  className="block"
                  value={inp ?? ""}
                  onChange={handleChangeInputs}
                  placeholder="stardew valley"
                />
              </div>
              <button
                id=""
                onClick={handleDeleteText}
                className="bg-slate-200 ml-auto mr-0 group"
                disabled={Object.values(value).length == 1}
              >
                ✖️ DEL text
              </button>
            </div>
          );
        })}
        <div className="p-1">
          <div className="ml-auto mr-0 w-fit">
            <button onClick={handleClickAddSeparator}>➕ ADD text</button>
          </div>
        </div>
      </details>
    </div>
  );
};
export default FormatValue;
