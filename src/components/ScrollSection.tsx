import { useContext } from "react";
import { MainContext } from "../hooks/context";
import { useScrollStore } from "../store/scrollStore";
import { useTabStore } from "../store/tabStore";
import { GoHeartFill, GoPencil, GoSquareFill } from "react-icons/go";
import { Link } from "react-router";
const findById = (data: any[], id: string): any | undefined => {
  for (const item of data) {
    if (item?.id === id) {
      return item; // 현재 객체에서 id를 찾음
    }

    // 중첩된 객체가 배열이라면 재귀 탐색
    if (item.value.length > 0) {
      findById(item.value, id);
    }
  }
};

const ScrollSection = () => {
  const { value } = useContext(MainContext);
  const { scroll } = useScrollStore();
  const { activeTab } = useTabStore();

  const handleScrollTo = (keyPath: string) => {
    const element = document.getElementById(keyPath);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <nav className="w-[4rem] bg-gray-100 shrink-0 sticky top-0 h-[100vh]">
      <div className="p-2">
        {/* 현재 탭의 스크롤 데이터만 탐색 */}
        {Object.entries(scroll[activeTab] ?? {}).map(([inputId, position]) => {
          const foundItem = findById(value, inputId); // 재귀적으로 id 탐색
          return (
            <div
              key={inputId + "marker"}
              className="group relative flex w-fit bookmarker"
              style={{ top: `${position}px` }}
            >
              <p className="shrink-0 text-blue-500 group-hover:absolute bookmark">
                {foundItem?.defaultValue ?? inputId}
              </p>
              <div
                className="shrink-0 w-[1rem] h-[.5rem]"
                onClick={() => {
                  handleScrollTo(inputId);
                }}
              >
                {foundItem?.type == "log" ? (
                  <GoPencil />
                ) : (
                  <GoHeartFill color="pink" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default ScrollSection;
