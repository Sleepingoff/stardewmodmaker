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

const InputSection = ({
  tabs,
  currentTab,
}: {
  tabs: string[];
  currentTab: number;
}) => {
  const { setter: setValue } = useContext(MainContext);
  const [inputs, setInputs] = useState<InputValue>({});
  useEffect(() => {
    tabs.forEach((tab, idx) => {
      setInputs((prev) => ({ ...prev, [idx]: [] }));
    });
  }, []);

  useEffect(() => {
    if (!setValue) return;
    setValue(inputs[currentTab] as Inputs);
  }, [inputs, currentTab]);

  return (
    <InputContext.Provider value={{ value: inputs, setter: setInputs }}>
      <section className="w-fit">
        <main className="h-[80vh]	 overflow-auto flex relative">
          {tabs.map((tabName, idx) => {
            if (idx == 0 && currentTab == idx)
              return <ManifestTab key={idx + "tab"} />;
            else if (idx == 1 && currentTab == idx)
              return <ContentTab key={idx + "tab"} />;
            else
              return currentTab == idx && <NewTab key={idx + "tab"} id={idx} />;
          })}
          <ScrollSection />
        </main>
      </section>
    </InputContext.Provider>
  );
};

export default InputSection;
