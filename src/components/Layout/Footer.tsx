interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer = ({ ...props }: FooterProps) => {
  return (
    <footer {...props}>
      <p>Footer</p>
    </footer>
  );
};

export default Footer;
