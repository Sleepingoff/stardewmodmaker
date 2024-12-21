import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormatContext, InputContext } from "../../hooks/context";
import DynamicButton from "../DynamicButton";
import ManifestGuide from "../../assets/manifest.json";
import useInitData from "../../hooks/useInitString";
import { useDynamicInputs } from "../../hooks/useDynamicInputs";
import FormatValue from "../FormatValue";
import { Inputs } from "../../type/types";
import convertInputsToJson from "../../utils/convertInputsToJson";

type Manifest = {
  Name: string;
  Author: string;
  Version: string;
  Description: string;
  UniqueID: string;
  UpdateKeys: string[];
  ContentPackFor: { [x: string]: string };
  Dependencies: { [x: string]: string | boolean }[];
};
const rawData = ManifestGuide["ko-KR"];

const data = {
  Name: rawData.Name,
  Author: rawData.Author,
  Version: rawData.Version,
  Description: rawData.Description,
  UniqueID: rawData.UniqueID,
  UpdateKeys: rawData.UpdateKeys,
  ContentPackFor: rawData.ContentPackFor,
  Dependencies: rawData.Dependencies,
};

const guide = {
  Name: data.Name.defaultValue,
  Author: data.Author.defaultValue,
  Version: data.Version.defaultValue,
  Description: data.Description.defaultValue,
  UniqueID: data.UniqueID.defaultValue,
  UpdateKeys: data.UpdateKeys.defaultValue.map((value) => value.defaultValue),
  ContentPackFor: {
    [data.ContentPackFor.defaultValue.key.defaultValue]:
      data.ContentPackFor.defaultValue.value.defaultValue,
  },
  Dependencies:
    data.Dependencies.defaultValue.defaultValue.key.availableValue.map(
      (key) => {
        return {
          [key]:
            data.Dependencies.defaultValue.defaultValue.value[
              key as keyof typeof data.Dependencies.defaultValue.defaultValue.value
            ].defaultValue,
        };
      }
    ),
};

const ManifestTab = () => {
  const { setter } = useContext(InputContext);
  const [manifest, setManifest] = useState<Partial<Manifest>>(guide);

  const [inputs, setInputs] = useState<Inputs>([
    {
      key: "Name",
      id: 0,
      parentId: [],
      value: [],
      type: "text",
      defaultValue: "Your Mod Name",
    },
    {
      key: "Author",
      id: 1,
      parentId: [],
      value: [],
      type: "text",
      defaultValue: "Your Name",
    },
    {
      key: "Version",
      id: 2,
      parentId: [],
      value: [],
      type: "text",
      defaultValue: "Version",
    },
    {
      key: "UniqueID",
      id: 13,
      parentId: [],
      value: [],
      type: "text",
      defaultValue: "Your Name.UniqueID",
    },
    {
      key: "Description",
      id: 3,
      parentId: [],
      value: [],
      type: "text",
      defaultValue: "Description",
    },
    {
      key: "UpdateKeys",
      id: 4,
      parentId: [],
      value: [
        {
          key: "0",
          id: 7,
          parentId: [4],
          value: [],
          type: "text",
          defaultValue: "Nexus:000",
        },
      ],
      type: "array",
    },
    {
      key: "ContentPackFor",
      id: 5,
      parentId: [],
      value: [
        {
          key: "UniqueID",
          id: 8,
          parentId: [5],
          value: [],
          type: "text",
          defaultValue: "Pathoschild.ContentPatcher",
        },
      ],
      type: "object",
    },
    {
      key: "Dependencies",
      id: 6,
      parentId: [],
      value: [
        {
          key: "0",
          id: 9,
          parentId: [6],
          value: [
            {
              key: "UniqueID",
              id: 10,
              parentId: [6, 9],
              value: [],
              type: "text",
              defaultValue: "Author.UniqueID",
            },
            {
              key: "IsRequired",
              id: 11,
              parentId: [6, 9],
              value: [],
              type: "text",
              defaultValue: "true",
            },
            {
              key: "minVersion",
              id: 12,
              parentId: [6, 9],
              value: [],
              type: "text",
              defaultValue: "0.0.0",
            },
          ],
          type: "object",
        },
      ],
      type: "array",
    },
  ]);
  useEffect(() => {
    if (!setter) return;
    const jsonOutput = convertInputsToJson(inputs);

    setter((prev) => ({
      ...prev,
      0: jsonOutput,
    }));
  }, [inputs, setter]);
  return (
    <section>
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <div className="w-full p-5 pl-0">
          {inputs.map((input) => (
            <FormatValue
              key={input.id + "format"}
              inputs={input}
              separator=","
            />
          ))}
        </div>
      </FormatContext.Provider>
    </section>
  );
};

export default ManifestTab;
