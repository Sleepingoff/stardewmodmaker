import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useState,
} from "react";
import ManifestTab from "./Tabs/ManifestTab";
import { InputContext, MainContext } from "../hooks/context";

// type InputContext = {
//     [key: number] : string;
// };

const InputSection = () => {
  const { value, setter: setValue } = useContext(MainContext);
  const [tabs, setTabs] = useState<string[]>(["manifest", "content"]);
  const [currentTab, setCurrentTab] = useState<string>("manifest");

  const handleClickNewTab: MouseEventHandler = () => {
    setTabs((prev) => [...prev, "newTab" + (tabs.length - 2)]);
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
    <InputContext.Provider value={value}>
      <section className="w-6/12">
        <header className="relative">
          <hgroup className="flex w-full overflow-auto bg-emerald-50">
            {tabs.map((tab, idx) => (
              <input
                key={idx}
                type="text"
                value={tab}
                onChange={handleChangeTabName}
                id={tab}
                className="block w-fit shrink py-2.5 bg-emerald-100 rounded-t-lg mx-0.5"
              />
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
        </main>
      </section>
    </InputContext.Provider>
  );
};

export default InputSection;
