import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import InputSection from "./components/InputSection";
import JsonPreviewSection from "./components/JsonSection";
import { MainContext } from "./hooks/context";
import { Inputs } from "./type/types";
import ScrollSection from "./components/ScrollSection";

function App() {
  const [inputs, setInputs] = useState<Inputs>([]);
  const [tabs, setTabs] = useState<string[]>(["manifest", "content"]);
  const [currentTab, setCurrentTab] = useState<number>(0);
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
    <>
      <header className="main-header">
        <h1>Stardew Mod Maker</h1>
        <hgroup className="flex w-full overflow-auto">
          {tabs.map((tab, idx) => (
            <h2 key={idx}>
              <span className="a11y-hidden">{tab}</span>
              <button onClick={handleClickTab} id={idx + ""} className="p-0">
                <input
                  type="text"
                  value={tab}
                  onChange={handleChangeTabName}
                  id={idx + ""}
                  className="block w-full shrink py-2.5"
                />
              </button>
            </h2>
          ))}
        </hgroup>
        <button
          onClick={handleClickNewTab}
          className="absolute ml-auto mr-0 inset-0 w-fit h-fit"
        >
          +
        </button>
      </header>
      <MainContext.Provider
        value={{
          value: inputs,
          setter: setInputs,
        }}
      >
        <main className="flex w-full">
          <InputSection tabs={tabs} currentTab={currentTab} />

          <JsonPreviewSection />
        </main>
      </MainContext.Provider>
    </>
  );
}

export default App;
