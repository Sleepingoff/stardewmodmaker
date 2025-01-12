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
import {
  GoDuplicate,
  GoFileDirectory,
  GoFileDirectoryFill,
  GoHeart,
  GoHeartFill,
  GoNoEntry,
  GoPlusCircle,
  GoRepo,
} from "react-icons/go";
import { useScrollStore } from "../store/scrollStore";
import { useTabStore } from "../store/tabStore";
import { Route } from "react-router";
import JsonPreview from "./JsonPreview";
import { useGlobalStore } from "../store/globalStore";
import Descriptions from "../assets/descriptions.json";

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
  const { setter }: FormatContextValue = useContext(FormatContext);

  const { Languages } = useGlobalStore();
  const contents = Descriptions[Languages];
  const [description, setDescription] =
    useState<Partial<Record<keyof typeof contents, string>>>();

  useEffect(() => {
    setDescription(Descriptions[Languages]);
  }, [Languages]);

  const { deleteScroll, setScroll } = useScrollStore();
  const { activeTab } = useTabStore();
  let ratioTop = 0;
  const [heart, setHeart] = useState(false);
  //type이 log인 경우, 현재 자신의 스크롤 위치를 기억
  useEffect(() => {
    if (!setter) return;
    if (!inputs?.type) return;
    const element = document.getElementById(inputs.id);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect();
    const elementTop = elementPosition.top + window.scrollY;
    const viewportHeight = window.innerHeight * 0.8;

    // 전체 윈도우 내부 높이에 대해 비례한 값
    ratioTop = (elementTop / viewportHeight) * 100;
    if (!heart) {
      deleteScroll(activeTab, ratioTop);
    }

    if (inputs.type == "log" || heart) {
      setScroll(activeTab, ratioTop, inputs);
    }
  }, [heart]);
  const handleClickAddBookMark: MouseEventHandler = (e) => {
    //summary click prevent
    e.stopPropagation();
    //하트 아이콘 모양 변경
    setHeart((prev) => !prev);
  };
  const handleDeleteKey: MouseEventHandler = (e) => {
    if (!setter) return;
    setter((prev) => [...deleteValueById(prev, inputs)]);
    deleteScroll(activeTab, ratioTop);
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
            <button className="ml-0" onClick={handleClickAddBookMark}>
              {heart ? <GoHeartFill color="pink" /> : <GoHeart />}
            </button>
            <input
              type="text"
              value={key}
              disabled={disabled}
              onChange={(e) => setKey(e.target.value)}
              // className="max-w-[10vw]"
            />
            {!disabled && <JsonPreview value={[inputs]} />}
          </summary>
          {inputs.description && (
            <p className="font-normal text-sm ml-1 text-wrap w-full">
              <GoRepo className="inline" />
              {(description &&
                description[inputs.description as keyof typeof description]) ??
                inputs.description}
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
      <div className="flex ml-auto h-fit">
        <DynamicButton
          type={availableTypes}
          handleClickTypes={handleClickAddNewValueOut}
        />
        <button
          className="h-fit bg-gray-100 mx-2 px-2"
          id=""
          onClick={handleDeleteKey}
        >
          <GoNoEntry color="red" className="inline" />{" "}
          <span className="text-sm w-full">DEL</span>
        </button>
      </div>
      {/* {afterInputs} */}
    </div>
  );
};

const Format = ({ input, disabled }: { input: Input; disabled?: boolean }) => {
  const { setter } = useContext(FormatContext);

  const { Languages } = useGlobalStore();
  const contents = Descriptions[Languages];
  const [description, setDescription] =
    useState<Partial<Record<keyof typeof contents, string>>>(contents);

  useEffect(() => {
    setDescription(contents);
  }, [Languages]);

  const { setScroll, deleteScroll } = useScrollStore();
  const { activeTab } = useTabStore();

  //boolean heart state
  const [heart, setHeart] = useState(false);
  //type이 log인 경우, 현재 자신의 스크롤 위치를 기억
  useEffect(() => {
    if (!setter) return;
    if (!input?.type) return;
    const element = document.getElementById(input.id);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect();
    const elementTop = elementPosition.top + window.scrollY;
    const viewportHeight = window.innerHeight * 0.8;

    // 전체 윈도우 내부 높이에 대해 비례한 값
    const ratioTop = (elementTop / viewportHeight) * 100;
    if (!heart) {
      deleteScroll(activeTab, ratioTop);
    }

    if (input.type == "log" || heart) {
      setScroll(activeTab, ratioTop, input);
    }
  }, [heart]);

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
  const handleClickAddBookMark: MouseEventHandler = (e) => {
    //summary click prevent
    e.stopPropagation();
    //하트 아이콘 모양 변경
    setHeart((prev) => !prev);
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
    <details open id={input.id} key={input.id}>
      <summary className="w-full shrink">
        <button className="ml-0" onClick={handleClickAddBookMark}>
          {heart ? <GoHeartFill color="pink" /> : <GoHeart />}
        </button>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={disabled}
        />
        {!disabled && <JsonPreview value={[input]} />}
      </summary>
      <label className="flex">
        {input.description && (
          <p className="font-normal text-sm text-wrap w-full">
            <GoRepo className="inline" />

            {(description &&
              description[input.description as keyof typeof description]) ??
              input.description}
          </p>
        )}
      </label>

      <button
        className="block m-auto mr-0 w-fit bg-gray-100"
        onClick={handleClickAddSeparator("-1")}
      >
        <GoFileDirectoryFill className="inline" />{" "}
        <span className="text-sm"> ADD TEXT</span>
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
                className="block w-full shrink"
                value={(value[i] as string) ?? ""}
                onChange={handleChangeTextarea}
                placeholder={input.placeholder ?? "stardew valley"}
              />
            </div>
            <button
              onClick={handleClickDeleteText(i)}
              className="bg-gray-100 ml-auto mr-0 group"
              disabled={id.length == 1}
            >
              <GoFileDirectory className="inline" />{" "}
              <span className="text-sm"> DEL TEXT</span>
            </button>
            <button
              onClick={handleClickAddSeparator(i)}
              className="bg-gray-100"
            >
              <GoFileDirectoryFill className="inline" />{" "}
              <span className="text-sm"> ADD TEXT</span>
            </button>
          </div>
        );
      })}
    </details>
  );
};
export default FormatValue;

const FormatNumber = ({ input }: { input: Input }) => {
  const { setter }: FormatContextValue = useContext(FormatContext);
  const { setScroll, deleteScroll } = useScrollStore();
  const { activeTab } = useTabStore();
  //boolean heart state
  const [heart, setHeart] = useState(false);
  //type이 log인 경우, 현재 자신의 스크롤 위치를 기억
  useEffect(() => {
    if (!setter) return;
    if (!input?.type) return;

    const element = document.getElementById(input.id);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect();
    const elementTop = elementPosition.top + window.scrollY;
    const viewportHeight = window.innerHeight * 0.8;

    // 전체 윈도우 내부 높이에 대해 비례한 값
    const ratioTop = (elementTop / viewportHeight) * 100;
    if (!heart) {
      deleteScroll(activeTab, ratioTop);
    }

    if (input.type == "log" || heart) {
      setScroll(activeTab, ratioTop, input);
    }
  }, [heart]);
  const handleClickAddBookMark: MouseEventHandler = (e) => {
    //summary click prevent
    e.stopPropagation();
    //하트 아이콘 모양 변경
    setHeart((prev) => !prev);
  };

  const [key, setKey] = useState<string>(input.key);
  const [value, setValue] = useState<string>(input.defaultValue as string);

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
        <button className="ml-0" onClick={handleClickAddBookMark}>
          {heart ? <GoHeartFill color="pink" /> : <GoHeart />}
        </button>
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
    </details>
  );
};

const FormatCheckBox = ({ input }: { input: Input }) => {
  const { setter }: FormatContextValue = useContext(FormatContext);
  const { setScroll, deleteScroll } = useScrollStore();
  const { activeTab } = useTabStore();
  //boolean heart state
  const [heart, setHeart] = useState(false);
  //type이 log인 경우, 현재 자신의 스크롤 위치를 기억
  useEffect(() => {
    if (!setter) return;
    if (!input?.type) return;

    const element = document.getElementById(input.id);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect();
    const elementTop = elementPosition.top + window.scrollY;
    const viewportHeight = window.innerHeight * 0.8;

    // 전체 윈도우 내부 높이에 대해 비례한 값
    const ratioTop = (elementTop / viewportHeight) * 100;
    if (!heart) {
      deleteScroll(activeTab, ratioTop);
    }

    if (input.type == "log" || heart) {
      setScroll(activeTab, ratioTop, input);
    }
  }, [heart]);
  const handleClickAddBookMark: MouseEventHandler = (e) => {
    //summary click prevent
    e.stopPropagation();
    //하트 아이콘 모양 변경
    setHeart((prev) => !prev);
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
    <details className="checkbox" key={input.id} open>
      <summary>
        <label htmlFor="checkbox" className="a11y-hidden">
          {key}
        </label>
        <button className="ml-0" onClick={handleClickAddBookMark}>
          {heart ? <GoHeartFill color="pink" /> : <GoHeart />}
        </button>
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

  const { Languages } = useGlobalStore();
  const contents = Descriptions[Languages];
  const [description, setDescription] =
    useState<Partial<Record<keyof typeof contents, string>>>();

  useEffect(() => {
    setDescription(Descriptions[Languages]);
  }, [Languages]);

  const [value, setValue] = useState<string>(input.defaultValue as string);
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
    <details className="log" id={input.id} key={input.id} open>
      <summary className="">
        <h3 className="font-black	">
          LogName <span className="a11y-hidden">{value}</span>
        </h3>
      </summary>
      {input.description && (
        <p className="font-normal text-sm text-wrap w-full">
          <GoRepo className="inline" />
          {(description &&
            description[input.description as keyof typeof description]) ??
            input.description}
        </p>
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
