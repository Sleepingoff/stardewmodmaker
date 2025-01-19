import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { FormatContext, InputContext } from "../hooks/context";
import { Inputs } from "../type/types";
import FormatValue from "./FormatValue";
import addUniqueId from "../utils/addUniqueId";
import DynamicButton from "./DynamicButton";
import generateNewInput from "../utils/generateNewInput";
import { useLocation, useParams } from "react-router";
import { useTabStore } from "../store/tabStore";

const ContentTab = () => {
  const { pathname } = useLocation();
  const currentFolder = pathname.split("/")[1];

  const { activeTab } = useTabStore();

  const { value, setter } = useContext(InputContext);
  const [inputs, setInputs] = useState<Inputs>([]);

  useEffect(() => {
    if (!pathname) return;

    const loadAllJson = async () => {
      try {
        // 디렉토리 내 JSON 파일 목록을 미리 알고 있다고 가

        // 모든 JSON 파일 비동기로 로드
        const promises = await fetch(
          `src/assets${pathname}/${
            activeTab === "0" ? "manifest" : "content"
          }.json`
        ).then((res) => {
          return res.json();
        });
        const guide = addUniqueId(promises);
        console.log(guide);

        setInputs(guide.locales["ko-KR"]);
      } catch (err) {
        console.log(err);
      }
    };

    loadAllJson();
  }, [pathname]);

  useEffect(() => {
    if (!setter) return;

    setter((prev) => ({
      ...prev,
      1: inputs,
    }));
  }, [inputs, setter]);

  const handleClickTypes =
    (type: string): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const newInputs = generateNewInput(type, inputs);
      setInputs((prev) => [newInputs, ...prev]);
    };
  return (
    <section className="w-full">
      <FormatContext.Provider value={{ value: inputs, setter: setInputs }}>
        <div className="p-5 pl-0 flex flex-col gap-2">
          <DynamicButton
            type={["text", "object", "array"]}
            handleClickTypes={handleClickTypes}
          />
          {inputs.map((input) => (
            <FormatValue key={input.id} inputs={input} separator="," />
          ))}
        </div>
      </FormatContext.Provider>
    </section>
  );
};

export default ContentTab;
