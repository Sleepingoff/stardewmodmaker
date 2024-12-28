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

const InputSection = () => {
  const { setter: setValue } = useContext(MainContext);
  const [inputs, setInputs] = useState<InputValue>({
    0: [],
    1: [],
  });
  const [tabs, setTabs] = useState<string[]>(["manifest", "content"]);
  const [currentTab, setCurrentTab] = useState<number>(0);

  useEffect(() => {
    if (!setValue) return;
    setValue(inputs[+currentTab]);
  }, [inputs, currentTab]);

  const handleClickNewTab: MouseEventHandler = () => {
    setTabs((prev) => [...prev, "newTab" + (tabs.length - 2)]);
  };
  const handleClickTab: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
    setCurrentTab(+target.id);
  };
  const handleChangeTabName: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setCurrentTab(+target.id);
    setTabs((prev) => [
      ...prev.splice(0, +target.id),
      target.value,
      ...prev.splice(1),
    ]);
  };
  return (
    <InputContext.Provider value={{ value: inputs, setter: setInputs }}>
      <section className="w-6/12">
        <header className="relative">
          <hgroup className="flex w-full overflow-auto">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={handleClickTab}
                id={idx + ""}
                className="p-0"
              >
                <input
                  type="text"
                  value={tab}
                  onChange={handleChangeTabName}
                  id={idx + ""}
                  className="block w-full shrink py-2.5"
                />
              </button>
            ))}
          </hgroup>
          <button
            onClick={handleClickNewTab}
            className="absolute ml-auto mr-0 inset-0 w-fit h-fit"
          >
            +
          </button>
        </header>
        <main className="h-[80vh]	 overflow-auto">
          {tabs.map((tabName, idx) => {
            if (idx == 0 && currentTab == idx)
              return <ManifestTab key={idx + "tab"} />;
            else if (idx == 1 && currentTab == idx)
              return <ContentTab key={idx + "tab"} />;
            else
              return (
                currentTab == idx && <NewTab key={idx + "tab"} id={idx + ""} />
              );
          })}
        </main>
      </section>
    </InputContext.Provider>
  );
};

export default InputSection;
