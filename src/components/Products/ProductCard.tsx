
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { Button } from '../ui/button';
import { ShoppingBag, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="candy-card group">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-white font-semibold text-lg">Out of Stock</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <p className="text-primary font-bold mt-2">${product.price.toFixed(2)}</p>
        <div className="mt-4">
          <Button 
            onClick={handleAddToCart} 
            disabled={!product.inStock}
            className="w-full bg-gradient-to-r from-candy-pink to-candy-peach hover:from-candy-peach hover:to-candy-pink"
          >
            <ShoppingBag size={16} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
