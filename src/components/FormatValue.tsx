import {
  ChangeEventHandler,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import DynamicButton from "./DynamicButton";
type Types = Array<string | Types>;
interface FormatType {
  types: Types;
  separator: string;
  beforeInputs?: string;
  afterInputs?: string;
  inputs: Types;
}

const FormatValue = ({
  types,
  beforeInputs,
  afterInputs,
  separator,
  inputs,
}: FormatType) => {
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };

  useEffect(() => {
    //types와 inputs의 길이 차이에 대한 예외처리
    if (types.length == inputs.length) return;
    if (types.length < inputs.length) {
      console.log(
        `types의 길이가 ${
          inputs.length - types.length
        }만큼 부족합니다. 임의로 마지막 type으로 지정합니다.`
      );
      inputs.forEach((input, idx) => {
        if (types.length - idx <= 0) types[idx] = types[types.length - 1];
      });
    } else {
      console.log(
        `types의 길이가 ${
          types.length - inputs.length
        }만큼 많습니다. 임의로 type에 따라 inputs를 늘립니다.`
      );
      types.forEach((_, idx) => {
        if (idx >= inputs.length) inputs.push("");
      });
    }
  }, [inputs]);
  return (
    <div key={inputs.join("")}>
      {beforeInputs}
      {inputs.map((input, idx) => {
        if (Array.isArray(types[idx]) && Array.isArray(input)) {
          {
            ("{");
          }
          return types[idx].map((type, inx) => (
            <FormatValue
              key={idx + separator + inx}
              types={[type]}
              separator={separator}
              afterInputs=","
              inputs={input as Types}
            />
          ));
          {
            ("}");
          }
        } else if (types[idx] == "array") {
          return (
            <FormatArray
              key={input as string}
              types={[]}
              separator={","}
              beforeInputs="["
              afterInputs="]"
              inputs={[input]}
            />
          );
        } else {
          return (
            <Format
              key={idx}
              separator={idx <= inputs.length - 1 ? separator : ""}
              currentKey={input as string}
            />
          );
        }
      })}
      {afterInputs}
    </div>
  );
};

const FormatArray = ({
  types,
  beforeInputs,
  afterInputs,
  separator,
  inputs,
}: FormatType) => {
  const [type, setNewInputType] = useState<string>("");
  const [currentTypes, setTypes] = useState<Types>(types);
  const [key, setKey] = useState<string>(inputs[0] as string);
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };

  useEffect(() => {
    if (!type) return;
    setTypes((prev) => [...prev, type == "object" ? [] : type]);
  }, [type]);
  return (
    <div className="w-full ml-5">
      <button id="" onClick={handleDeleteKey}>
        delete
      </button>
      <details>
        <summary>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </summary>
        {beforeInputs}
        {currentTypes.map((type, inx) => {
          if (Array.isArray(type)) {
            return (
              <div key={inx + "" + new Date()}>
                <FormatValue
                  types={[type]}
                  separator={separator}
                  beforeInputs="{"
                  afterInputs="},"
                  inputs={[inx + ""]}
                />
              </div>
            );
          } else {
            return (
              <div key={inx + "" + new Date()}>
                <FormatValue
                  types={[type]}
                  separator={separator}
                  afterInputs=","
                  inputs={[inx + ""]}
                />
              </div>
            );
          }
        })}
        <DynamicButton
          type={["text", "object", "array"]}
          setNewInputType={setNewInputType}
        />
        {afterInputs}
      </details>
    </div>
  );
};

const FormatKey = ({
  types,
  beforeInputs,
  afterInputs,
  separator,
  inputs,
}: FormatType) => {
  const [key, setKey] = useState<string>("");
  const [type, setNewInputType] = useState<string>("");
  const [currentTypes, setTypes] = useState<Types>(types);
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };
  const handleClickAddSeparator: MouseEventHandler = () => {
    setTypes((prev) => [...prev, ""]);
  };
  useEffect(() => {
    if (!type) return;
    setTypes((prev) => [...prev, type == "object" ? [] : type]);
  }, [type]);

  return (
    <div className="w-full ml-5">
      <button id="" onClick={handleDeleteKey}>
        delete
      </button>
      <details>
        <summary>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </summary>
        <FormatValue
          inputs={inputs}
          types={currentTypes}
          separator={separator}
          afterInputs={afterInputs}
          beforeInputs={beforeInputs}
        />
      </details>
      <DynamicButton
        type={["text", "object", "array"]}
        setNewInputType={setNewInputType}
      />
    </div>
  );
};
const Format = ({
  separator,
  currentKey,
  disabled,
}: {
  separator?: string;
  currentKey: string;
  disabled?: boolean;
}) => {
  const [key, setKey] = useState<string>(currentKey);
  const [sep, setInput] = useState<string>("");
  const [inputs, setInputs] = useState<string[]>([""]);
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };
  const handleChangeSep: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setInput(target.value);
  };
  const handleClickAddSeparator: MouseEventHandler = () => {
    setInputs((prev) => [...prev, ""]);
  };
  const handleChangeInputs: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setInputs((prev) =>
      prev.map((p, idx) => {
        if (idx == +target.id) {
          return target.value;
        }
        return p;
      })
    );
  };
  return (
    <div className="w-full ml-5">
      <details>
        <summary>
          <button id="" className="mt-2" onClick={handleDeleteKey}>
            delete all
          </button>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={disabled}
          />
        </summary>{" "}
        {inputs.map((input, idx) => {
          return (
            <div key={input + idx}>
              {!!sep && sep}
              <input
                className="w-full"
                type={typeof input == "string" ? "text" : typeof input}
                value={input}
                onChange={handleChangeInputs}
              />
            </div>
          );
        })}
        <div className="flex ml-auto p-1">
          <button onClick={handleClickAddSeparator}>add</button>
          <input
            className="p-0"
            onChange={handleChangeSep}
            value={sep}
            placeholder="input separator"
          />
        </div>
      </details>
    </div>
  );
};
export { FormatValue, FormatKey };
