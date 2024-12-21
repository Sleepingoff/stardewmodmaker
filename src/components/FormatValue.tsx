import {
  ChangeEventHandler,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import DynamicButton from "./DynamicButton";
import { FormatContext } from "../hooks/context";
import { Input, Inputs, NewType, Types, Value } from "../type/types";
interface FormatType {
  separator: string;
  beforeInputs?: string;
  afterInputs?: string;
  inputs: Input;
  disabled?: boolean;
  addInputs: Dispatch<SetStateAction<Inputs>>;
}
interface FormatStartType {
  separator: string;
  beforeInputs?: string;
  afterInputs?: string;
  inputs: Inputs;
}
const FormatValue = ({
  beforeInputs,
  afterInputs,
  separator,
  inputs,
  addInputs,
}: FormatType) => {
  const { value, setter } = useContext(FormatContext);
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };
  const [currentInputs, setCurrentInputs] = useState<Inputs>(inputs!.value);

  const [type, setNewInputType] = useState<NewType>({
    target: "",
    id: "",
  });
  useEffect(() => {
    if (!type.target) return;
    const newType = [type.target];
    const newInputs =
      type.target == "text"
        ? {
            id: (inputs.id + new Date().getSeconds()) * 100,
            key: "test" + type.target,
            value: [],
            type: newType as Types,
            defaultValue: " ",
          }
        : {
            id: (inputs.id + new Date().getSeconds()) * 100,
            key: "test" + type.target,
            value: [
              {
                id: (inputs.id + new Date().getSeconds()) * 1000,
                key: "test",
                value: [],
                type: ["text"],
                defaultValue: " ",
              },
            ],
            type: newType as Types,
          };
    addInputs((prev) => {
      return [...prev, newInputs];
    });
    setCurrentInputs((prev) => [...currentInputs]);
    setNewInputType((prev) => ({ ...prev, target: "" }));
  }, [type]);
  const [key, setKey] = useState<string>(inputs.key ?? "");
  return (
    <div key={inputs.id + (inputs.type[0] as string)} id={inputs.id + ""}>
      {beforeInputs}
      {!inputs?.defaultValue ? (
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
            {currentInputs.map((input, idx) => {
              return (
                <FormatValue
                  key={idx + (inputs.type[0] as string) + input.id}
                  addInputs={setCurrentInputs}
                  separator={","}
                  beforeInputs={
                    idx == 0 ? (inputs.type[0] == "array" ? "[" : "{") : ""
                  }
                  afterInputs={
                    idx == currentInputs.length - 1
                      ? inputs.type[0] == "array"
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
        <Format inputs={inputs} />
      )}

      <DynamicButton
        id={inputs.id}
        type={["text", "object", "array"]}
        setNewInputType={setNewInputType}
      />
      {afterInputs}
    </div>
  );
};

const FormatStart = ({
  beforeInputs,
  afterInputs,
  separator,
  inputs,
}: FormatStartType) => {
  const { value, setter } = useContext(FormatContext);

  return (
    <div className="w-full ml-5">
      {inputs.map((input) => (
        <FormatValue
          addInputs={setter}
          key={input.id}
          inputs={input}
          separator={separator}
          afterInputs={afterInputs}
          beforeInputs={beforeInputs}
        />
      ))}
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
  const handleChangeSep: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setSep(target.value);
  };
  const handleClickAddSeparator: MouseEventHandler = () => {
    const lastIndex = Object.values(values).length;
    setValues((prev) => ({
      ...prev,
      [lastIndex]: {
        id: inputs.id,
        key: key,
        value: "",
      },
    }));
  };
  useEffect(() => {
    if (!key) return;
    const currentValue = (sep ?? "") + Object.values(value).join(sep ?? "");
    const newValue = {
      id: inputs.id,
      key: key,
      value: currentValue,
    };
    setValues((prev) => ({ ...prev, [+id]: newValue }));
  }, [value, key, sep]);

  useEffect(() => {
    // if (!setter) return;
    // setter(values);
  }, [values]);

  const handleChangeInputs: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setId((prev) => target.id);
    setValue((prev) => ({
      ...prev,
      [target.id]: target.value,
    }));
  };
  return (
    <div className="w-full ml-5" id={inputs.id + ""}>
      <details>
        <summary>
          <button id="" className="mt-2" onClick={handleDeleteKey}>
            delete all
          </button>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </summary>{" "}
        {Object.values(values).map((input, idx) => {
          return (
            <div key={inputs.id + "" + idx * 1000}>
              {!!sep && sep}
              <input
                id={idx + ""}
                className="w-full"
                type="text"
                value={value[idx] ?? ""}
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
export default FormatStart;
