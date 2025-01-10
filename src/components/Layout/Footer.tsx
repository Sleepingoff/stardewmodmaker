import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";
import { useGlobalStore } from "../../store/globalStore";
import { Languages } from "../../type/jsonKeys";

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer = ({ ...props }: FooterProps) => {
  const { Languages, setLanguages } = useGlobalStore();

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguages(e.target.value as Languages);
  };
  return (
    <footer {...props}>
      <section className="my-2 px-2">
        <label htmlFor="language-select" className="font-semibold mr-2">
          🌐 Language
        </label>
        <select
          id="language-select"
          className="border-none bg-blue-100 rounded-md p-1"
          value={Languages}
          onChange={handleChangeLanguage}
        >
          <option value="en-US">English</option>
          <option value="ko-KR">한국어</option>
        </select>
      </section>
      <section className="inner text-center">
        <h3 className="font-semibold mb-2 ">Open Source</h3>
        <p>License: MIT</p>
        <Link
          to={"https://github.com/Sleepingoff/stardewmodmaker"}
          target="_blank"
        >
          <FaGithub className="inline" /> Sleepingoff
        </Link>
      </section>
      <p className="p-2 text-center">
        <b>Hi~</b> justjh30@gmail.com
      </p>
    </footer>
  );
};

export default Footer;
