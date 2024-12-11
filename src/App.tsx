import { useState } from "react";
import InputSection from "./components/InputSection";
import JsonPreviewSection from "./components/JsonSection";
import { MainContext } from "./hooks/context";

function App() {
  const [inputs, setInputs] = useState<string>("");

  return (
    <>
      <header>
        <h1>Stardew Mod Maker</h1>
      </header>
      <MainContext.Provider
        value={{
          value: inputs,
          setter: setInputs,
        }}
      >
        <main className="flex w-full">
          <InputSection />
          <JsonPreviewSection />
        </main>
      </MainContext.Provider>
    </>
  );
}

export default App;
