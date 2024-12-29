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
import { Field, IdField, Input, Inputs, NewType } from "../type/types";
import { FormatContextValue } from "../type/context";
import addValueByParentId from "../utils/addValueByParentId";
import updateValueById from "../utils/updateValueById";
import { v4 as uuidv4 } from "uuid"; // UUID를 생성하기 위한 패키지
import deleteValueById from "../utils/deleteValueById";
import generateNewInput from "../utils/generateNewInput";

interface FormatType {
  separator: string;
  beforeInputs?: string;
  afterInputs?: string;
  inputs: IdField;
  disabled?: boolean;
}

const FormatValue = ({
  beforeInputs,
  afterInputs,
  disabled,
  inputs,
}: FormatType) => {
  const { value, setter }: FormatContextValue = useContext(FormatContext);
  const handleDeleteKey: MouseEventHandler = (e) => {
    if (!setter) return;
    setter((prev) => [...deleteValueById(prev, inputs)]);
  };
  const [currentInputs, setCurrentInputs] = useState<IdField[]>(inputs!.value);

  useEffect(() => {
    //!inputs 상태 변경 인식을 잘 못하는 문제때문에 작성
    setCurrentInputs(inputs.value || []);
  }, [inputs]);

  const [key, setKey] = useState<string>(inputs.key);

  const handleClickAddNewValueIn =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const newInputs = generateNewInput(type, inputs);
      if (!setter) return;
      setter((prev) => [
        ...addValueByParentId(
          prev,
          [...inputs.parentId, inputs.id],
          newInputs,
          inputs.id
        ),
      ]);
    };

  const handleClickAddNewValueOut =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const newInputs = generateNewInput(type, inputs);
      if (!setter) return;

      setter((prev) => [
        ...addValueByParentId(prev, inputs.parentId, newInputs, inputs.id),
      ]);
    };
  return (
    <div key={inputs.id} id={inputs.id} className="">
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
                <div key={input.id}>
                  <FormatValue
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
                    inputs={
                      inputs.type == "array"
                        ? { ...input, key: idx + "" }
                        : { ...input }
                    }
                  />
                </div>
              );
            })}
            {currentInputs.length == 0 && inputs.type != "text" && (
              <DynamicButton
                type={["text", "object", "array"]}
                handleClickTypes={handleClickAddNewValueIn}
                text=" add new value"
              />
            )}
          </details>
        </div>
      ) : (
        <Format input={inputs} disabled={disabled} />
      )}

      <DynamicButton
        type={["text", "object", "array"]}
        handleClickTypes={handleClickAddNewValueOut}
      />
      {/* {afterInputs} */}
    </div>
  );
};

const Format = ({ input, disabled }: { input: Input; disabled?: boolean }) => {
  const { setter } = useContext(FormatContext);
  const [key, setKey] = useState<string>(input.key);
  const [sep, setSep] = useState<string>("");
  const [id, setId] = useState<string[]>(["0"]);

  const [value, setValue] = useState<{
    [x: string]: string;
  }>({ 0: input.defaultValue ?? "" });

  const handleDeleteKey: MouseEventHandler = (e) => {
    if (!setter) return;
    setter((prev) => [...deleteValueById(prev, input)]);
  };
  const handleClickDeleteText =
    (idx: string): MouseEventHandler =>
    () => {
      if (id.length === 1) return; // `id` 배열에 하나만 남아있을 때 삭제를 방지

      setId((prev) => prev.filter((pr) => pr !== idx)); // 삭제 대상 제외
      setValue((prev) => {
        const updatedValue = { ...prev };
        delete updatedValue[idx]; // 해당 `idx`를 가진 값을 삭제
        return updatedValue;
      });
    };

  const handleChangeSep: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setSep(target.value);
  };
  const handleClickAddSeparator =
    (idx: string): MouseEventHandler =>
    () => {
      const targetIndex = id.findIndex((i) => i == idx);
      const newId = uuidv4();
      setId((prev) => {
        return [...prev.splice(0, targetIndex + 1), newId, ...prev];
      });
      setValue((prev) => ({
        ...prev,
        [newId]: "",
      }));
    };

  useEffect(() => {
    if (!setter) return;
    //value[idx]가 빈 값이 아닐 때만 currentValue에 추가
    const currentValue =
      (sep ?? "") +
      id
        .map((i) => value[i])
        .filter((v) => !!v)
        .join(sep ?? "");
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
    <div className="w-full" id={input.id} key={input.id}>
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
          <button onClick={handleDeleteKey} className="shrink-0">
            ❌ delete {key}
          </button>
        </summary>
        {/* 없는 id를 넣어서 가장 맨 앞에 추가 */}
        <button onClick={handleClickAddSeparator("-1")}>➕ ADD text</button>
        {id.map((i) => {
          return (
            <div key={i} className="w-full flex flex-wrap">
              <div className="flex w-full mt-0.5 shrink-0">
                <span className=" bg-slate-200 rounded-md py-0.5 px-2 mr-0.5">
                  {!!sep ? sep : " "}
                </span>
                <textarea
                  ref={textRef}
                  id={i}
                  className="block"
                  value={value[i] ?? ""}
                  onChange={handleChangeInputs}
                  placeholder="stardew valley"
                />
              </div>
              <button
                onClick={handleClickDeleteText(i)}
                className="bg-slate-200 ml-auto mr-0 group"
                disabled={id.length == 1}
              >
                ✖️ DEL text
              </button>
              <button onClick={handleClickAddSeparator(i)}>➕ ADD text</button>
            </div>
          );
        })}
        <div className="p-1">
          <div className="ml-auto mr-0 w-fit"></div>
        </div>
      </details>
    </div>
  );
};
export default FormatValue;
