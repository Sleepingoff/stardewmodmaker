import { useContext, useEffect, useState } from "react";
import { MainContext } from "../hooks/context";
import { Inputs } from "../type/types";

const ScrollSection = () => {
  const { value } = useContext(MainContext);
  const [scrollPosition, setScrollPosition] = useState<number>(10);

  const handleScrollTo = (keyPath: string) => {
    const element = document.getElementById(keyPath);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const findLogKeys = (
    data: Inputs,
    parentKey = "",
    depth = 0
  ): JSX.Element[] => {
    return data.flatMap((input, index) => {
      const fullKey = parentKey ? `${parentKey}.${input.key}` : input.key;

      if (input.type === "log") {
        const offset = index * 30; // 각 로그 키의 고정 간격 (필요시 조정)
        const adjustedPosition = scrollPosition + offset;
        return (
          <div
            key={input.id}
            className={`group relative flex w-fit bookmarker`}
            style={{ top: `${adjustedPosition}px` }}
          >
            <p className="shrink-0 text-blue-500 group-hover:absolute bookmark">
              {input.defaultValue}
            </p>
            <button
              className="shrink-0 w-[1rem] h-[.5rem] "
              onClick={() => handleScrollTo(input.id)}
            ></button>
          </div>
        );
      }

      if (
        (input.type === "object" || input.type === "array") &&
        Array.isArray(input.value)
      ) {
        // 재귀적으로 하위 데이터 탐색
        return findLogKeys(input.value, fullKey, depth + 1);
      }

      return [];
    });
  };

  return (
    <nav className="w-[2rem] bg-gray-100 h-full shrink-0 sticky top-0 right-0">
      <div className="p-2">{value && findLogKeys(value)}</div>
    </nav>
  );
};

export default ScrollSection;
