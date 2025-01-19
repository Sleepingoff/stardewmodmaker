import { useContext, useEffect } from "react";
import { InputContext, MainContext } from "../../hooks/context";
import ContentTab from "../ContentTab";
import { Inputs } from "../../type/types";
import { useInputStore } from "../../store/inputStore";

const InputSection = ({
  tabs,
  currentTab,
}: {
  tabs: string[];
  templates: {
    fileName: string;
    content: any;
  }[];
  currentTab: string;
}) => {
  const { inputs, setInputs, initializeInputs } = useInputStore();
  const { setter: setValue } = useContext(MainContext);

  useEffect(() => {
    // 탭 초기화
    initializeInputs(tabs);
  }, [tabs, initializeInputs]);

  useEffect(() => {
    if (!setValue) return;
    setValue(inputs[currentTab] as Inputs);
  }, [inputs, currentTab, setValue]);

  return (
    <InputContext.Provider value={{ value: inputs, setter: setInputs }}>
      <section className=" w-[60%]  mx-2">
        <main className="relative">
          {tabs.map((tabName, idx) => {
            if (currentTab == idx + "") {
              return <ContentTab key={tabName + "tab"} />;
            }
          })}
        </main>
      </section>
    </InputContext.Provider>
  );
};

export default InputSection;
