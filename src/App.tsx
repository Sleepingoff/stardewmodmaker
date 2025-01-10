import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import InputSection from "./components/Section/InputSection";
import JsonPreviewSection from "./components/Section/JsonSection";
import { MainContext } from "./hooks/context";
import { Inputs } from "./type/types";
import { Template, useTabStore } from "./store/tabStore";
import { TemplateType } from "./type/template";
import { useInputStore } from "./store/inputStore";
import { GoX } from "react-icons/go";
import ScrollSection from "./components/Section/ScrollSection";
import { BrowserRouter } from "react-router";

const jsonFiles = ["Include"]; // 불러올 JSON 파일의 이름 목록

function App() {
  const {
    tabs,
    templates,
    activeTab,
    setTabs,
    setTemplates,
    setActiveTab,
    resetStore,
    initialStore,
  } = useTabStore();

  const { resetInputs } = useInputStore();
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
  //handleClickRemoveAll mouse event handler

  const handleClickRemoveAll: MouseEventHandler = () => {
    //zustand store의 tabs와 templates를 초기화
    localStorage.clear();
    resetStore();
    resetInputs();
    setActiveTab("-1");
    setInputs((prev) => []);
  };

  useEffect(() => {
    initialStore();
    setActiveTab("0");
  }, []);

  const handleClickRemoveFile: MouseEventHandler = (e) => {
    const target = e.target as HTMLButtonElement;
    if (!target) return;
    const targetId = +target?.id;

    if (targetId === 0) return;
    setTabs([...tabs.slice(0, targetId), ...tabs.slice(targetId + 1)]);
    setActiveTab("0");
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
        <hgroup className="flex w-full">
          <h1>Stardew Mod Maker</h1>
          <p className="my-auto">
            : Not connected to server. Data may be lost.
          </p>
        </hgroup>
        <button
          onClick={handleClickRemoveAll}
          className="absolute ml-auto mr-0 inset-0 w-fit h-fit"
        >
          - reset all files
        </button>
        <hgroup className="flex w-full overflow-auto">
          <span className="my-auto mx-2 w-20">Files: </span>
          {tabs.map((tab, idx) => (
            <h2 key={idx} className="relative w-fit my-2 group">
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
              {idx === 0 ? null : (
                <button
                  id={idx + ""}
                  onClick={handleClickRemoveFile}
                  className="hidden group-hover:block absolute z-10 right-1 top-0 bg-red-100 py-1"
                >
                  <GoX />
                </button>
              )}
            </h2>
          ))}
          <button
            onClick={handleClickNewTab}
            className="absolute ml-auto mr-0 inset-0 w-fit h-fit"
          >
            + add new file
          </button>
        </hgroup>
        <section className="flex w-full overflow-auto relative">
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
          <ScrollSection />
          <JsonPreviewSection />
        </main>
      </MainContext.Provider>
    </>
  );
}

export default App;
