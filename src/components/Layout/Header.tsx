
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { ShoppingBag, Menu, X, Settings } from "lucide-react";

const Header = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#c0c0c0] border-b border-[#808080]">
      <div className="container mx-auto px-2 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-[#333]">
            Jazzy Jizz Products
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/admin">
            <Button 
              variant="outline" 
              size="sm"
              className="sketchy-button"
            >
              <Settings size={16} className="mr-1" />
              Admin Panel
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#333]">
                {user.username}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="sketchy-button"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                size="sm"
                className="sketchy-button"
              >
                Admin Login
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative">
            <Button 
              variant="outline" 
              size="icon"
              className="sketchy-button h-8 w-8"
            >
              <ShoppingBag size={16} />
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
          className="md:hidden sketchy-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#c0c0c0] border-t border-[#808080] py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              to="/admin"
              className="text-[#333] py-1 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings size={16} className="mr-1" />
              Admin Panel
            </Link>
            
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="text-[#333] py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-[#808080]">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-[#333]">
                    {user.username}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="sketchy-button"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    variant="outline" 
                    className="sketchy-button w-full"
                  >
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
              <Button 
                variant="default" 
                className="sketchy-button w-full flex justify-center"
              >
                <ShoppingBag size={16} className="mr-2" />
                Your Cart ({totalItems})
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
