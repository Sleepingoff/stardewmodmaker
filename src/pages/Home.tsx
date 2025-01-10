import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import PageLayout from "../components/Layout/Page";
import { useGlobalStore } from "../store/globalStore";
const Home = () => {
  //global state
  const { Languages } = useGlobalStore();
  return (
    <PageLayout>
      <main></main>
    </PageLayout>
  );
};

export default Home;
