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
import addUniqueId from "../utils/addUniqueId";

interface FormatType {
  separator: string;
  beforeInputs?: string;
  afterInputs?: string;
  inputs: IdField;
  disabled?: boolean;
  availableTypes?: string[];
  template?: Field[];
}

const FormatValue = ({
  disabled,
  inputs,
  availableTypes = ["log", "text", "number", "checkbox", "object", "array"],
  template = [],
}: FormatType) => {
  const { value, setter }: FormatContextValue = useContext(FormatContext);
  const handleDeleteKey: MouseEventHandler = (e) => {
    if (!setter) return;
    setter((prev) => [...deleteValueById(prev, inputs)]);
  };
  const [currentInputs, setCurrentInputs] = useState<IdField[]>(inputs!.value);

  useEffect(() => {
    //!inputs 상태 변경 인식을 잘 못하는 문제때문에 작성
    setCurrentInputs(inputs.value ?? []);
  }, [inputs]);

  const [key, setKey] = useState<string>(inputs.key);

  useEffect(() => {
    if (!setter) return;

    const newValue = {
      ...inputs,
      key,
    };
    setter((prev) => [...updateValueById(prev, newValue)]);
  }, [key]);

  const handleClickAddNewValueIn =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      let newInputs = generateNewInput(type, inputs);
      if (template[0]) {
        newInputs = addUniqueId({
          InitialRequired: [],
          locales: { "ko-KR": template },
        }).locales["ko-KR"][0];

        if (!setter) return;
        setter((prev) => [
          ...addValueByParentId(
            prev,
            [...inputs.parentId, inputs.id, newInputs.id],
            newInputs,
            inputs.id
          ),
        ]);
      } else {
        if (!setter) return;
        setter((prev) => [
          ...addValueByParentId(
            prev,
            [...inputs.parentId, inputs.id],
            newInputs,
            inputs.id
          ),
        ]);
      }
    };

  const handleClickAddNewValueOut =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      let newInputs = generateNewInput(type, inputs);
      if (template[0]) {
        newInputs = addUniqueId({
          InitialRequired: [],
          locales: { "ko-KR": template },
        }).locales["ko-KR"][0];
      }
      if (!setter) return;

      setter((prev) => [
        ...addValueByParentId(prev, inputs.parentId, newInputs, inputs.id),
      ]);
    };

  const isTypeArrayOrObject = inputs.type == "array" || inputs.type == "object";
  return (
    <div key={inputs.id} id={inputs.id} className="flex w-full">
      {!isTypeArrayOrObject ? (
        <Format input={inputs} disabled={disabled} />
      ) : (
        <details open>
          {/* {beforeInputs} */}
          <summary className={inputs.type}>
            <input
              type="text"
              value={key}
              disabled={disabled}
              onChange={(e) => setKey(e.target.value)}
              // className="max-w-[10vw]"
            />
          </summary>
          {inputs.description && (
            <p className="font-normal text-sm ml-1">
              <span>✏️</span>
              {inputs.description}
            </p>
          )}
          {currentInputs.map((input, idx) => {
            return (
              <FormatValue
                key={input.id}
                disabled={inputs.type == "array"}
                separator={","}
                inputs={
                  inputs.type == "array"
                    ? { ...input, key: idx + "" }
                    : { ...input }
                }
                template={inputs.template}
                // 부모의 availableTypes에 따라 자식의 타입을 제한
                availableTypes={inputs.availableTypes}
              />
            );
          })}
          {currentInputs.length == 0 && isTypeArrayOrObject && (
            <DynamicButton
              type={availableTypes}
              handleClickTypes={handleClickAddNewValueIn}
            />
          )}
        </details>
      )}
      <div className="flex ml-auto">
        <button className="h-fit " id="" onClick={handleDeleteKey}>
          ❌
        </button>
        <DynamicButton
          type={availableTypes}
          handleClickTypes={handleClickAddNewValueOut}
        />
      </div>
      {/* {afterInputs} */}
    </div>
  );
};

const Format = ({ input, disabled }: { input: Input; disabled?: boolean }) => {
  const { setter } = useContext(FormatContext);
  const [key, setKey] = useState<string>(input.key);
  const [sep, setSep] = useState<string>(input.separator ?? "");
  const [id, setId] = useState<string[]>(["0"]);

  const [value, setValue] = useState<{
    [x: string]: string | number | boolean;
  }>({ 0: input.defaultValue ?? "" });
  useEffect(() => {
    if (sep == "" || !input?.defaultValue) return;
    const newValue = input.defaultValue
      .toString()
      .split(sep)
      .filter((v) => v != "");
    setValue((prev) => Object(newValue));
    setId((prev) =>
      Array(newValue.length)
        .fill(0)
        .map((i, idx) => idx + "")
    );
  }, []);

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
    let currentValue = (sep ?? "") + id.map((i) => value[i]).join(sep ?? "");
    if (key == "Target" || key == "FromFile") {
      currentValue = id.map((i) => value[i]).join(sep ?? "");
    }
    const newValue = {
      key: key,
      defaultValue: currentValue,
      parentId: input.parentId,
      id: input.id,
      separator: sep,
    };
    setter((prev) => [...updateValueById(prev, newValue)]);
  }, [value, key, sep]);

  const handleChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
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

  if (input.type == "number") {
    return <FormatNumber input={input} />;
  }

  if (input.type == "checkbox") {
    return <FormatCheckBox input={input} />;
  }

  if (input.type == "log") {
    return <FormatLog input={input} />;
  }
  return (
    <details open className="" id={input.id} key={input.id}>
      <summary className="w-fit shrink">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={disabled}
        />
      </summary>
      <label className="flex">
        {input.description && (
          <p className="font-normal text-sm">
            <span>✏️</span>
            {input.description}
          </p>
        )}
      </label>

      <button
        className="block m-auto mr-0 w-fit"
        onClick={handleClickAddSeparator("-1")}
      >
        ➕ ADD text
      </button>
      {id.map((i, idx) => {
        return (
          <div key={i} className="w-full flex flex-wrap">
            <div className="flex w-full mt-0.5 shrink">
              <span className=" bg-slate-200 rounded-md py-0.5 px-2 mr-0.5">
                <input
                  className="ml-0.5 ml-auto min-w-[1rem] w-[1.5rem] border-none h-full"
                  onChange={handleChangeSep}
                  value={sep}
                  placeholder=" "
                />
              </span>
              <textarea
                ref={textRef}
                id={i}
                className="block"
                value={(value[i] as string) ?? ""}
                onChange={handleChangeTextarea}
                placeholder={input.placeholder ?? "stardew valley"}
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
    </details>
  );
};
export default FormatValue;

const FormatNumber = ({ input }: { input: Input }) => {
  const { setter }: FormatContextValue = useContext(FormatContext);

  const [key, setKey] = useState<string>(input.key);
  const [value, setValue] = useState<string>(input.defaultValue as string);
  const handleDeleteKey: MouseEventHandler = (e) => {
    if (!setter) return;
    setter((prev) => [...deleteValueById(prev, input)]);
  };

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setValue((prev) => target.value);
  };

  useEffect(() => {
    if (!setter) return;
    const newValue = {
      key: key,
      defaultValue: value,
      parentId: input.parentId,
      id: input.id,
    };
    setter((prev) => [...updateValueById(prev, newValue)]);
  }, [value, key]);

  return (
    <details className="number" id={input.id} key={input.id} open>
      <summary>
        <input
          type="text"
          className="shrink w-20"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </summary>
      <span className="w-5 text-center mx-2">:</span>
      <input
        type="number"
        className="inline"
        value={value ?? 0}
        onChange={handleChangeInput}
      />
      {/* <button onClick={handleDeleteKey} className="shrink-0 w-fit ml-auto">
        ❌
      </button> */}
    </details>
  );
};

const FormatCheckBox = ({ input }: { input: Input }) => {
  const { setter }: FormatContextValue = useContext(FormatContext);
  const handleDeleteKey: MouseEventHandler = (e) => {
    if (!setter) return;
    setter((prev) => [...deleteValueById(prev, input)]);
  };
  const [key, setKey] = useState<string>(input.key);
  const [value, setValue] = useState<boolean>(
    input.defaultValue == "true" ? true : false
  );

  const handleCheckInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue((prev) => !prev);
  };
  useEffect(() => {
    if (!setter) return;
    const newValue = {
      key: key,
      defaultValue: value,
      parentId: input.parentId,
      id: input.id,
    };
    setter((prev) => [...updateValueById(prev, newValue)]);
  }, [value, key]);
  return (
    <details className="checkbox" key={input.id}>
      <summary>
        <label htmlFor="checkbox" className="a11y-hidden">
          {key}
        </label>
        <input
          id="checkbox"
          className="w-80"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </summary>
      <label className="flex w-1/4 mx-auto mr-0">
        <input
          className="a11y-hidden"
          id={input.id}
          type="checkbox"
          checked={value}
          value={`${value ?? "false"}`}
          onChange={handleCheckInput}
        />
        <span className="font-normal"></span>
      </label>
    </details>
  );
};

const FormatLog = ({ input }: { input: Input }) => {
  const { setter }: FormatContextValue = useContext(FormatContext);
  const [value, setValue] = useState<string>(input.defaultValue as string);
  const handleDeleteKey: MouseEventHandler = (e) => {
    if (!setter) return;
    setter((prev) => [...deleteValueById(prev, input)]);
  };
  const handleChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target as HTMLTextAreaElement;
    setValue(target.value);
  };
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;
    const textareaElement = textRef.current as HTMLTextAreaElement;
    textareaElement.style.height = `${textareaElement.scrollHeight}px`;
    if (!setter) return;
    setter((prev) => [
      ...updateValueById(prev, { ...input, defaultValue: value }),
    ]);
  }, [value]);
  return (
    <details className="log" id={input.id} key={input.id}>
      <summary className="">
        <h3 className="font-black	">
          LogName <span className="a11y-hidden">{value}</span>
        </h3>
        {/* <button onClick={handleDeleteKey} className="shrink-0 ml-auto">
          ❌
        </button> */}
      </summary>
      {input.description && (
        <p className="font-normal text-sm">✏️{input.description}</p>
      )}
      <textarea
        ref={textRef}
        id={input.id}
        className="block"
        value={value ?? ""}
        onChange={handleChangeTextarea}
        placeholder={input.placeholder ?? "input Log Name"}
      />
    </details>
  );
};
