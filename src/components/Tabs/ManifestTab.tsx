import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { InputContext } from "../../hooks/context";
import DynamicButton from "../DynamicButton";
import ManifestGuide from "../../assets/manifest.json";
import useInitData from "../../hooks/useInitString";
import { useDynamicInputs } from "../../hooks/useDynamicInputs";

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
  const { inputs, addInput, updateInput, removeInput } = useDynamicInputs();
  // Array 타입의 값을 업데이트
  const handleArrayChange = (id: string, index: number, value: string) => {
    const input = inputs.find((input) => input.id === id);
    if (input?.type === "array") {
      const updatedValues = input.values.map((v, i) =>
        i === index ? value : v
      );
      updateInput(id, { values: updatedValues });
    }
  };

  // Object 타입의 값을 업데이트
  const handleObjectChange = (
    id: string,
    index: number,
    keyOrValue: "key" | "value",
    value: string
  ) => {
    const input = inputs.find((input) => input.id === id);
    if (input?.type === "object") {
      const updatedPairs = input.pairs.map((pair, i) =>
        i === index ? { ...pair, [keyOrValue]: value } : pair
      );
      updateInput(id, { pairs: updatedPairs });
    }
  };

  const guideString = useInitData<(typeof ManifestGuide)["ko-KR"], Manifest>(
    ManifestGuide["ko-KR"]
  );

  const { setter } = useContext(InputContext);
  const [manifest, setManifest] = useState<Partial<Manifest>>(guide);

  const [NewInputType, setNewInputType] = useState<string>("");
  useEffect(() => {
    if (!NewInputType) return;
  }, [NewInputType]);

  // useEffect(() => {
  //   setManifest((prev) => {
  //     let returnValue = prev;
  //     Object.keys(data).map((key) => {
  //       const type: string | string[] = data[key as keyof typeof data].type;
  //       let defaultValue = data[key as keyof typeof data].defaultValue;
  //       if (type === "array" && Array.isArray(defaultValue)) {
  //         returnValue = {
  //           ...prev,
  //           [key]: defaultValue.map((value) => value.defaultValue).join(","),
  //         };
  //       } else if (type === "object") {
  //         returnValue = {
  //           ...prev,
  //         };
  //       } else {
  //         if (typeof defaultValue != "object") {
  //           returnValue = {
  //             ...prev,
  //             [key]: guideString[key as keyof Manifest],
  //           };
  //         }
  //         returnValue = {
  //           ...prev,
  //           [key]: guideString[key as keyof Manifest],
  //         };
  //       }
  //     });
  //     return returnValue;
  //   });
  // }, []);

  useEffect(() => {
    if (!setter) return;

    setter((prev) => ({
      ...prev,
      manifest: {
        ...manifest,
        UniqueID: manifest.Author + "." + manifest.UniqueID,
      },
    }));
  }, [manifest, setter]);

  const handleChangeInputs: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.id == "UniqueID") {
      setManifest((prev) => ({
        ...prev,
        [target.id]: target.value,
      }));
    } else if (target.id == "UpdateKeys") {
      setManifest((prev) => ({
        ...prev,
        [target.id]: target.value.split(",").filter((v) => v != ""),
      }));
    } else setManifest((prev) => ({ ...prev, [target.id]: target.value }));
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <section>
      <form onSubmit={handleSubmitForm}>
        {Object.keys(manifest).map((key) => (
          <label className="block m-1" key={key}>
            {key} :
            <input
              className="block m-1"
              type="text"
              value={manifest[key as keyof Manifest] as string}
              onChange={handleChangeInputs}
              id={key}
            />
          </label>
        ))}

        {/* <label className="block m-1">
          Name:
          <input
            type="text"
            value={manifest.Name}
            onChange={handleChangeInputs}
            id="Name"
          />
        </label>
        <label className="block m-1">
          Author:
          <input
            type="text"
            value={manifest.Author}
            onChange={handleChangeInputs}
            id="Author"
          />
        </label>
        <label className="block m-1">
          Version:
          <input
            type="text"
            value={manifest.Version}
            onChange={handleChangeInputs}
            id="Version"
          />
        </label>
        <label className="block m-1">
          Description:
          <input
            type="text"
            value={manifest.Description}
            onChange={handleChangeInputs}
            id="Description"
          />
        </label>
        <label className="block m-1">
          UniqueID:{manifest.Author}.
          <input
            type="text"
            value={manifest.UniqueID}
            onChange={handleChangeInputs}
            id="UniqueID"
          />
        </label>
        <label className="block m-1">
          UpdateKeys:
          <input
            type="text"
            value={manifest.UpdateKeys}
            onChange={handleChangeInputs}
            id="UpdateKeys"
            placeholder="separator: ,"
          />
        </label>
        <label id="ContentPackFor" className="block m-1">
          ContentPackFor:
          <label>
            UniqueId:
            <input
              type="text"
              value={manifest.ContentPackFor.UniqueID}
              onChange={handleChangeInputs}
              id="ContentPackFor.UniqueID"
            />
          </label>
        </label> */}
      </form>
    </section>
  );
};

export default ManifestTab;
