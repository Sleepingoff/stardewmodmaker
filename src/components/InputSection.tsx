import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import ManifestTab from "./Tabs/ManifestTab";
import { InputContext, MainContext } from "../hooks/context";
import { InputValue } from "../type/context";
import ContentTab from "./Tabs/ContentTab";
import NewTab from "./Tabs/NewTab";
import { Inputs } from "../type/types";
import ScrollSection from "./ScrollSection";
import TempTab from "./Tabs/TempTab";
import { useInputStore } from "../store/inputStore";

const InputSection = ({
  tabs,
  templates,
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
      <section className="w-fit">
        <main className="h-[80vh]	 overflow-auto flex relative">
          {currentTab.startsWith("template")
            ? templates.map((temp, idx) => {
                return (
                  currentTab == "template" + idx && (
                    <TempTab
                      id={"template" + idx}
                      key={"template" + idx}
                      temp={temp}
                    />
                  )
                );
              })
            : tabs.map((tabName, idx) => {
                if (currentTab == idx + "") {
                  if (idx == 0) return <ManifestTab key={idx + "tab"} />;
                  else if (idx == 1) return <ContentTab key={idx + "tab"} />;
                  else return <NewTab key={idx + "tab"} id={idx + "tab"} />;
                }
              })}

          <ScrollSection />
        </main>
      </section>
    </InputContext.Provider>
  );
};

export default InputSection;
