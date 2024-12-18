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

const InputSection = () => {
  const { setter: setValue } = useContext(MainContext);
  const [inputs, setInputs] = useState<InputValue>({
    manifest: {},
    content: {},
  });
  const [tabs, setTabs] = useState<string[]>(["manifest", "content"]);
  const [currentTab, setCurrentTab] = useState<string>("manifest");

  useEffect(() => {
    if (!setValue) return;
    setValue(JSON.stringify(inputs[currentTab], null, "\t"));
  }, [inputs[currentTab]]);

  const handleClickNewTab: MouseEventHandler = () => {
    setTabs((prev) => [...prev, "newTab" + (tabs.length - 2)]);
  };
  const handleClickTab: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
    setCurrentTab(target.id);
  };
  const handleChangeTabName: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setCurrentTab(target.id);
    const indexOfTarget = tabs.findIndex((tab) => tab === target.id);
    setTabs((prev) => {
      prev[indexOfTarget] = target.value;
      return prev;
    });
  };
  return (
    <InputContext.Provider value={{ value: inputs, setter: setInputs }}>
      <section className="w-6/12">
        <header className="relative">
          <hgroup className="flex w-full overflow-auto bg-emerald-50">
            {tabs.map((tab, idx) => (
              <button key={idx} onClick={handleClickTab} id={tab}>
                <input
                  type="text"
                  value={tab}
                  onChange={handleChangeTabName}
                  id={tab}
                  className="block w-fit shrink py-2.5 bg-emerald-100 rounded-t-lg mx-0.5"
                />
              </button>
            ))}
          </hgroup>
          <button
            onClick={handleClickNewTab}
            className="absolute ml-auto mr-0 inset-0 w-fit h-fit bg-emerald-50	"
          >
            +
          </button>
        </header>
        <main className="bg-emerald-100 h-full">
          {currentTab == "manifest" && <ManifestTab />}
          {currentTab == "content" && <ContentTab />}
        </main>
      </section>
    </InputContext.Provider>
  );
};

export default InputSection;
