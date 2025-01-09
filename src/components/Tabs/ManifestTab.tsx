import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { FormatContext, InputContext } from "../../hooks/context";
import ManifestGuide from "../../assets/manifest.json";
import FormatValue from "../FormatValue";
import addUniqueId from "../../utils/addUniqueId";
import { Input, Inputs, NewType } from "../../type/types";
import DynamicButton from "../DynamicButton";
import { v4 as uuidv4 } from "uuid"; // UUID를 생성하기 위한 패키지
import addValueByParentId from "../../utils/addValueByParentId";
import generateNewInput from "../../utils/generateNewInput";
// [
//   {
//     key: "Name",
//     id: 0,
//     parentId: [],
//     value: [],
//     type: "text",
//     defaultValue: "Your Mod Name",
//   },
//   {
//     key: "Author",
//     id: 1,
//     parentId: [],
//     value: [],
//     type: "text",
//     defaultValue: "Your Name",
//   },
//   {
//     key: "Version",
//     id: 2,
//     parentId: [],
//     value: [],
//     type: "text",
//     defaultValue: "Version",
//   },
//   {
//     key: "UniqueID",
//     id: 13,
//     parentId: [],
//     value: [],
//     type: "text",
//     defaultValue: "Your Name.UniqueID",
//   },
//   {
//     key: "Description",
//     id: 3,
//     parentId: [],
//     value: [],
//     type: "text",
//     defaultValue: "Description",
//   },
//   {
//     key: "UpdateKeys",
//     id: 4,
//     parentId: [],
//     value: [
//       {
//         key: "0",
//         id: 7,
//         parentId: [4],
//         value: [],
//         type: "text",
//         defaultValue: "Nexus:000",
//       },
//     ],
//     type: "array",
//   },
//   {
//     key: "ContentPackFor",
//     id: 5,
//     parentId: [],
//     value: [
//       {
//         key: "UniqueID",
//         id: 8,
//         parentId: [5],
//         value: [],
//         type: "text",
//         defaultValue: "Pathoschild.ContentPatcher",
//       },
//     ],
//     type: "object",
//   },
//   {
//     key: "Dependencies",
//     id: 6,
//     parentId: [],
//     value: [
//       {
//         key: "0",
//         id: 9,
//         parentId: [6],
//         value: [
//           {
//             key: "UniqueID",
//             id: 10,
//             parentId: [6, 9],
//             value: [],
//             type: "text",
//             defaultValue: "Author.UniqueID",
//           },
//           {
//             key: "IsRequired",
//             id: 11,
//             parentId: [6, 9],
//             value: [],
//             type: "text",
//             defaultValue: "true",
//           },
//           {
//             key: "minVersion",
//             id: 12,
//             parentId: [6, 9],
//             value: [],
//             type: "text",
//             defaultValue: "0.0.0",
//           },
//         ],
//         type: "object",
//       },
//     ],
//     type: "array",
//   },
// ];

const guide = addUniqueId(ManifestGuide);
const ManifestTab = () => {
  const { value, setter } = useContext(InputContext);

  const [inputs, setInputs] = useState<Inputs>(
    value[0] ? (value[0] as Inputs) : guide.locales["ko-KR"]
  );
  useEffect(() => {
    if (!setter) return;

    setter((prev) => ({
      ...prev,
      0: [...inputs],
    }));
  }, [inputs, setter]);

  const handleClickTypes =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const newInputs = generateNewInput(type, inputs);
      setInputs((prev) => [newInputs, ...prev]);
    };

  return (
    <section>
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <div className="w-[40vw] p-5 pl-0 flex flex-col gap-2">
          <DynamicButton
            type={["text", "object", "array"]}
            handleClickTypes={handleClickTypes}
            open={true}
          />
          {inputs.map((input) => (
            <FormatValue key={input.id} inputs={input} separator="," />
          ))}
        </div>
      </FormatContext.Provider>
    </section>
  );
};

export default ManifestTab;
