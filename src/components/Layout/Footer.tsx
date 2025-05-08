
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#c0c0c0] border-t border-[#808080] mt-auto py-2">
      <div className="container mx-auto px-2 text-center">
        <p className="text-sm text-[#333]">
          &copy; {new Date().getFullYear()} Jazzy Jizz Products
        </p>
      </div>
    </footer>
  );
};

export default Footer;
