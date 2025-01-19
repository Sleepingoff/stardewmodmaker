import { HTMLAttributes, useEffect, useState } from "react";
import Descriptions from "../../assets/descriptions.json";
import { useGlobalStore } from "../../store/globalStore";
import { Link } from "react-router";
import { GoCodeOfConduct } from "react-icons/go";
import { menu } from "../../constants/menu";

interface HeaderProps extends HTMLAttributes<HTMLHeadElement> {}

type Descriptions = typeof Descriptions;

const Header = ({ ...props }: HeaderProps) => {
  const { Languages } = useGlobalStore();
  const contents = Descriptions[Languages];
  const [description, setDescription] =
    useState<Partial<Record<keyof typeof contents, string>>>();

  useEffect(() => {
    setDescription(Descriptions[Languages]);
  }, [Languages]);

  return (
    <header {...props}>
      <h1 className="h-fit text-center">Stardew Canvas</h1>
      <nav className="w-full ml-auto text-right">
        <Link to={`/`}>Home</Link>
        <ul>
          {menu.map((item) => (
            <li key={item.id + "menu"}>
              <Link to={`/${item.route}`}>{item.route}</Link>
            </li>
          ))}
        </ul>
        <p>
          <GoCodeOfConduct className="inline" /> {description?.header}
        </p>
      </nav>
    </header>
  );
};

export default Header;
