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

const updateValueByParentIdOptimized = (
  inputs: Inputs,
  parentId: number[],
  newValue: Input,
  position?: number
): Inputs => {
  const targetDepth = parentId.length - 1;

  const recursiveUpdate = (items: Inputs, currentDepth: number): Inputs => {
    return items.map((item) => {
      if (
        item.parentId.length === targetDepth &&
        item.parentId.every((id, i) => id === parentId[i])
      ) {
        // 현재 depth에서 parentId가 일치하면 value를 업데이트
        if (!!position) {
          return {
            ...item,
            value: [
              ...item.value.splice(0, position + 1),
              newValue,
              ...item.value,
            ],
          };
        } else
          return {
            ...item,
            value: [...item.value, newValue],
          };
      }

      if (Array.isArray(item.value) && currentDepth < targetDepth) {
        // value가 배열이고 더 깊은 depth를 탐색해야 할 경우 재귀
        return {
          ...item,
          value: recursiveUpdate(item.value, currentDepth + 1),
        };
      }

      return item; // 일치하지 않으면 원본 유지
    });
  };

  return recursiveUpdate(inputs, 0);
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
        ...updateValueByParentIdOptimized(
          prev,
          parentId,
          newInputs,
          addPosition
        ),
      ]);
    }
  }, [type]);

  useEffect(() => {
    //!inputs 상태 변경 인식을 잘 못하는 문제때문에 작성
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
      className="pl-5 pr-2.5"
    >
      {beforeInputs}
      {!inputs?.defaultValue ? (
        <div className="w-full">
          <details open>
            <summary>
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
        <Format inputs={inputs} disabled={inputs.type == "array"} />
      )}

      <DynamicButton
        id={inputs.id}
        position={position ?? 0}
        type={["text", "object", "array"]}
        setNewInputType={setNewInputType}
      />
      {afterInputs}
    </div>
  );
};

const Format = ({
  // currentKey,
  inputs,
  disabled,
}: {
  // currentKey: string;
  inputs: Input;
  disabled?: boolean;
}) => {
  // const { value: key, setter: setKey } = useContext(FormatContext);
  const [key, setKey] = useState<string>(inputs.key);
  const [sep, setSep] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [value, setValue] = useState<{
    [x: string]: string;
  }>({ 0: inputs.defaultValue ?? "" });
  const [values, setValues] = useState<{
    [x: string]: string | number;
  }>({});
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
    const lastIndex = Object.values(values).length;
    setValues((prev) => ({
      ...prev,
      [lastIndex]: {
        key: key,
        value: "",
      },
    }));
  };
  useEffect(() => {
    if (!key) return;
    const currentValue = (sep ?? "") + Object.values(value).join(sep ?? "");
    const newValue = {
      key: key,
      value: currentValue,
    };
    setValues((prev) => ({ ...prev, [inputs.id]: newValue }));
  }, [value, key, sep]);

  useEffect(() => {
    // console.log(values);
  }, [values]);

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
      id={inputs.id + ""}
      key={inputs.id + "text" + "container"}
    >
      <details open>
        <summary>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={disabled}
          />
          <button id="" onClick={handleDeleteKey}>
            ❌
          </button>
        </summary>{" "}
        {Object.values(values).map((input, idx) => {
          return (
            <div key={inputs.id + "text" + idx} className="w-full">
              <div className="w-full flex">
                {!!sep && (
                  <span className=" bg-slate-200 rounded-md py-0.5 px-2 mr-5 ">
                    {sep}
                  </span>
                )}
                <button
                  id=""
                  onClick={handleDeleteText}
                  className="bg-slate-200 ml-auto mr-0 group"
                  disabled={Object.values(values).length == 1}
                >
                  <span className="scale-0 group-hover:scale-100">
                    delete under text{" "}
                  </span>
                  ✖️
                </button>
              </div>
              <textarea
                ref={textRef}
                id={idx + ""}
                className="block"
                value={value[idx] ?? ""}
                onChange={handleChangeInputs}
              />
            </div>
          );
        })}
        <div className="flex ml-auto p-1">
          <div className="bg-slate-200	rounded-md">
            <button onClick={handleClickAddSeparator}>➕</button>
            <button disabled className="rounded-md">
              ✂️
            </button>
          </div>
          <input
            className="p-0 px-5 w-50"
            onChange={handleChangeSep}
            value={sep}
            placeholder="input separator"
          />
        </div>
      </details>
    </div>
  );
};
export default FormatValue;
