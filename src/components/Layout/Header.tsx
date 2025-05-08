
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { ShoppingBag, User, Menu, X } from "lucide-react";

const Header = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-candy-pink to-candy-purple flex items-center justify-center">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-candy-red to-candy-purple bg-clip-text text-transparent">
            Candy Carnival
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-primary">
            Shop
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-primary">
            About
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" className="text-gray-700 hover:text-primary">
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hi, {user.username}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <User size={18} className="mr-2" />
                Admin Login
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative">
            <Button variant="outline" size="icon">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-gray-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex justify-between items-center pt-4 border-t">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-600">
                    Hi, {user.username}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    <User size={18} className="mr-2" />
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
            <Link 
              to="/cart" 
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button variant="default" className="w-full">
                <ShoppingBag size={18} className="mr-2" />
                Cart ({totalItems})
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
