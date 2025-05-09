
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { Button } from '../ui/button';
import { ShoppingBag, Info } from 'lucide-react';
import { useState } from 'react';
import ProductDetails from './ProductDetails';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Helper function to display currencies
  const displayCurrencies = () => {
    if (!product.currencies || product.currencies.length === 0) {
      return <p className="font-bold mt-1">{product.price} pencils</p>;
    }

    return (
      <div className="mt-1">
        <p className="font-bold">{product.price} pencils</p>
        {product.currencies.map((currency, index) => (
          <p key={index} className="text-sm mt-0.5">
            {currency.amount} {currency.type}
          </p>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="sketchy-card">
        <div 
          className="aspect-square relative overflow-hidden cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <p className="text-white font-bold">Out of Stock</p>
            </div>
          )}
        </div>
        <div className="p-2 bg-[#c0c0c0]">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">{product.name}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1" 
              onClick={() => setShowDetails(true)}
            >
              <Info size={16} />
            </Button>
          </div>
          {displayCurrencies()}
          <div className="mt-2">
            <Button 
              onClick={handleAddToCart} 
              disabled={!product.inStock}
              className="sketchy-button w-full text-center flex justify-center"
            >
              <ShoppingBag size={16} className="mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      <ProductDetails 
        product={product} 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
      />
    </>
  );
};

export default ProductCard;
