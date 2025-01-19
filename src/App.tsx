import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Mod from "./pages/Mod";
import PageLayout from "./components/Layout/Page";
import { menu } from "./constants/menu";

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
        {menu.map((route) => {
          return (
            <Route key={route.id} path={`/${route.route}`} element={<Mod />} />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
