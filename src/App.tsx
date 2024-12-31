import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import InputSection from "./components/InputSection";
import JsonPreviewSection from "./components/JsonSection";
import { MainContext } from "./hooks/context";
import { Inputs } from "./type/types";
import { Template, useTabStore } from "./store/tabStore";
import { TemplateType } from "./type/template";

const jsonFiles = ["Include"]; // 불러올 JSON 파일의 이름 목록

function App() {
  const { tabs, templates, activeTab, setTabs, setTemplates, setActiveTab } =
    useTabStore();
  const [inputs, setInputs] = useState<Inputs>([]);

  const handleClickNewTab: MouseEventHandler = () => {
    setTabs([...tabs, "newTab" + (tabs.length - 2)]);
  };

  const handleClickNewTemp: MouseEventHandler = () => {
    setTemplates((state) => [
      ...state.templates,
      {
        fileName: "newTab" + (tabs.length - 2),
        content: { key: "LogName", value: [], type: "log", template: [] },
      },
    ]);
  };

  const handleClickTab: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
    setActiveTab(target.id);
  };

  const handleChangeTabName: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setActiveTab(target.id);
    setTabs([
      ...tabs.slice(0, +target.id),
      target.value,
      ...tabs.slice(+target.id + 1),
    ]);
  };

  const handleChangeTempName: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setActiveTab(target.id);
    const targetTempIndex = +target.id.split("template")[1];
    setTemplates((state) => [
      ...state.templates.slice(0, targetTempIndex),
      { fileName: target.value, content: templates[targetTempIndex].content },
      ...state.templates.slice(targetTempIndex + 1),
    ]);
  };

  useEffect(() => {
    // JSON 파일 불러오기
    jsonFiles.map((file) => {
      import(`./assets/template/temp.${file}.json`)
        .then((res) => res.default as Record<string, any>) // 명시적으로 타입 설정
        .then((res) => {
          setTemplates((state) => {
            // 중복 확인
            const exists = state.templates.some(
              (template) => template.fileName === file
            );
            if (exists) return [...state.templates]; // 중복이면 추가하지 않음

            return [
              ...state.templates,
              { fileName: file, content: res } as Template,
            ];
          });
        })
        .catch((_) => null);
    });
  }, []);

  return (
    <>
      <header className="main-header">
        <h1>Stardew Mod Maker</h1>
        <hgroup className="flex w-full overflow-auto">
          <span className="my-auto mx-2 w-20">Files: </span>
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
          <button
            onClick={handleClickNewTab}
            className="absolute ml-auto mr-0 inset-0 w-fit h-fit"
          >
            + add new file
          </button>
        </hgroup>
        <section className="flex w-full overflow-auto">
          <span className="my-auto mx-2 w-20">Templates: </span>
          {templates.map((temp, idx) => (
            <h3 key={idx + "temp"} className="w-fit my-2">
              <span className="a11y-hidden">{temp.fileName}</span>
              <button onClick={handleClickTab} id={idx + ""} className="p-0">
                <input
                  type="text"
                  value={temp.fileName}
                  onChange={handleChangeTempName}
                  id={"template" + idx}
                  className="block w-full shrink py-2.5 w-[8rem] h-[2rem]"
                />
              </button>
            </h3>
          ))}
          <button
            onClick={handleClickNewTemp}
            className="absolute ml-auto mr-0 inset-0 w-fit h-fit"
          >
            + add new template
          </button>
        </section>
      </header>
      <MainContext.Provider
        value={{
          value: inputs,
          setter: setInputs,
        }}
      >
        <main className="flex w-full">
          <InputSection
            tabs={tabs}
            templates={templates}
            currentTab={activeTab}
          />
          <JsonPreviewSection />
        </main>
      </MainContext.Provider>
    </>
  );
}

export default App;
