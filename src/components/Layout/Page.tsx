import Footer from "./Footer";
import Header from "./Header";

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PageLayout = ({ children, ...props }: PageLayoutProps) => {
  return (
    <main {...props}>
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default PageLayout;
