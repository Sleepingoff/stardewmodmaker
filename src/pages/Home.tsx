import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useGlobalStore } from "../store/globalStore";
import PageLayout from "../components/Layout/Page";
import Descriptions from "../assets/descriptions.json";
const Home = () => {
  //global state
  const { Languages } = useGlobalStore();
  const contents = Descriptions[Languages];
  const [description, setDescription] =
    useState<Partial<Record<keyof typeof contents, string>>>();

  useEffect(() => {
    setDescription(Descriptions[Languages]);
  }, [Languages]);

  return (
    <PageLayout>
      <header>
        <hgroup>
          <h2>Stardew Canvas</h2>
          <p>{description?.intro1}</p>
          <p>{description?.intro2}</p>
        </hgroup>
      </header>
      <main className="w-full"></main>
    </PageLayout>
  );
};

export default Home;
