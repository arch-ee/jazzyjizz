
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Candy Commerce Carnival
            </h3>
            <p className="text-gray-600 mb-4">
              The sweetest online destination for all your candy cravings!
              Explore our delicious selection of treats that will bring joy to
              your taste buds.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-primary">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>123 Sugar Lane</li>
              <li>Candy Town, Sweet State</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@candycarnival.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Candy Commerce Carnival. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
