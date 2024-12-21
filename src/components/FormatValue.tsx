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
  addTypes: Dispatch<SetStateAction<Types>>;
}
interface FormatArrayType {
  beforeInputs?: string;
  afterInputs: string;
  separator: string;
  parent: Input;
  inputs: Inputs;
  addInputs: Dispatch<SetStateAction<Inputs>>;
  addTypes: Dispatch<SetStateAction<Types>>;
}

interface FormatStartType {
  separator: string;
  beforeInputs?: string;
  afterInputs?: string;
  inputs: Inputs;
  setType: Dispatch<SetStateAction<Types>>;
}
const FormatValue = ({
  beforeInputs,
  afterInputs,
  separator,
  inputs,
  addInputs,
  addTypes,
}: FormatType) => {
  const { value, setter } = useContext(FormatContext);
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };
  const [currentInputs, setCurrentInputs] = useState<Inputs>(inputs!.value);
  const [currentTypes, setCurrentTypes] = useState<Types>(inputs!.type);

  const [type, setNewInputType] = useState<NewType>({
    target: "",
    id: inputs.id,
  });
  useEffect(() => {
    if (!type.target) return;
    const newType = type.target == "object" ? [["text"]] : [type.target];
    const newInputs = {
      id: (inputs.id + new Date().getSeconds()) * 100,
      key: "test",
      value: [
        {
          id: (inputs.id + new Date().getSeconds()) * 1000,
          key: "test",
          value: [],
          type: ["text"],
          defaultValue: "",
        },
      ],
      type: newType as Types,
    };

    setCurrentInputs((prev) => [...prev, newInputs]);
    setNewInputType((prev) => ({ ...prev, target: "" }));
  }, [type]);

  useEffect(() => {
    setCurrentTypes((prev) => currentInputs.map((inp) => inp.type).flat());
  }, [currentInputs]);

  return (
    <div key={inputs.id} id={inputs.id + ""}>
      {beforeInputs}

      {currentInputs.length > 0 ? (
        inputs.type.map((t, idx) => {
          if (Array.isArray(t)) {
            return t.map((y, inx) => (
              <FormatArray
                key={idx + "" + inx}
                parent={inputs}
                addInputs={setCurrentInputs}
                addTypes={setCurrentTypes}
                separator={","}
                beforeInputs="{"
                afterInputs="}"
                inputs={currentInputs}
              />
            ));
          } else if (t == "array") {
            return (
              <FormatArray
                key={idx + separator}
                parent={inputs}
                addInputs={setCurrentInputs}
                addTypes={setCurrentTypes}
                separator={","}
                beforeInputs="["
                afterInputs="]"
                inputs={inputs.value}
              />
            );
          }
        })
      ) : (
        <Format inputs={inputs} />
      )}

      {afterInputs}
      <DynamicButton
        id={inputs.id}
        type={["text", "object", "array"]}
        setNewInputType={setNewInputType}
      />
    </div>
  );
};

const FormatArray = ({
  beforeInputs,
  afterInputs,
  separator,
  parent,
  inputs: values,
  addInputs,
  addTypes,
}: FormatArrayType) => {
  const [key, setKey] = useState<string>(parent.key);
  const handleDeleteKey: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
  };

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
        {values.map((value, inx) => {
          return (
            <FormatValue
              addTypes={addTypes}
              key={inx + "" + new Date()}
              addInputs={addInputs}
              separator={separator}
              afterInputs=","
              inputs={value}
            />
          );
        })}
        {afterInputs}
      </details>
    </div>
  );
};

const FormatStart = ({
  beforeInputs,
  afterInputs,
  separator,
  inputs,
  setType,
}: FormatStartType) => {
  const { value, setter } = useContext(FormatContext);

  return (
    <div className="w-full ml-5">
      {inputs.map((input) => (
        <FormatValue
          addTypes={setType}
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
