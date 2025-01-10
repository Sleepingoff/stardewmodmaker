import { HTMLAttributes } from "react";

interface HeaderProps extends HTMLAttributes<HTMLHeadElement> {}

const Header = ({ ...props }: HeaderProps) => {
  return (
    <header {...props}>
      <h1>Header</h1>
    </header>
  );
};

export default Header;
