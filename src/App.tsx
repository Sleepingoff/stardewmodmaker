import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import ContentPatcher from "./pages/mods/ContentPatcher";
import PageLayout from "./components/Layout/Page";

function App() {
  return (
    <BrowserRouter basename="/stardewmodmaker">
      <Routes>
        <Route
          path="/"
          element={<Home />}
          errorElement={
            <PageLayout>
              <div></div>
            </PageLayout>
          }
        />
        <Route path="/ContentPatcher" element={<ContentPatcher />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
