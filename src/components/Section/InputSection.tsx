import { useContext, useEffect } from "react";
import { InputContext, MainContext } from "../../hooks/context";
import ContentTab from "../ContentTab";
import { Inputs } from "../../type/types";
import { useInputStore } from "../../store/inputStore";
import { useTabStore } from "../../store/tabStore";

const InputSection = ({ tabs }: { tabs: string[] }) => {
  const { inputs, setInputs, initializeInputs } = useInputStore();
  const { setter } = useContext(MainContext);
  const { activeTab } = useTabStore();
  useEffect(() => {
    // 탭 초기화
    initializeInputs(tabs);
  }, [tabs, initializeInputs]);

  useEffect(() => {
    if (!setter) return;
    setter(inputs[activeTab] as Inputs);
  }, [inputs, activeTab, setter]);

  return (
    <InputContext.Provider value={{ value: inputs, setter: setInputs }}>
      <section className=" w-[60%]  mx-2">
        <main className="relative">
          {tabs.map((tabName, idx) => {
            if (activeTab == idx + "") {
              return <ContentTab key={tabName + "tab"} />;
            }
          })}
        </main>
      </section>
    </InputContext.Provider>
  );
};

export default InputSection;
