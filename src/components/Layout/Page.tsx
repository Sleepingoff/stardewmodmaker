import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PageLayout = ({ children, ...props }: PageLayoutProps) => {
  return (
    <main className="flex flex-wrap	gap-4" {...props}>
      <Header className="grow-0 basis-60 sticky top-2 h-[50vh] m-2 over z-10" />
      <main className="grow max-w-[75%] shrink">{children}</main>
      <Footer className="grow-0 basis-60 sticky bottom-2 h-fit m-2 over" />
    </main>
  );
};

export default PageLayout;
