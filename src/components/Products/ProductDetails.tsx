
import { Product } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductDetailsProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetails = ({ product, isOpen, onClose }: ProductDetailsProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    onClose();
  };

  // Helper function to display currencies
  const displayCurrencies = () => {
    if (!product.currencies || product.currencies.length === 0) {
      return <p className="text-lg font-bold mt-1">{product.price} pencils</p>;
    }

    return (
      <div className="mt-1">
        <p className="text-lg font-bold">{product.price} pencils</p>
        {product.currencies.map((currency, index) => (
          <p key={index} className="text-sm mt-0.5">
            {currency.amount} {currency.type}
          </p>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="aspect-square relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Price</h3>
              {displayCurrencies()}
            </div>
            
            <div>
              <h3 className="font-semibold">Category</h3>
              <p>{product.category || "Uncategorized"}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold">Availability</h3>
            <p>{product.inStock ? "In Stock" : "Out of Stock"}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            onClick={handleAddToCart} 
            disabled={!product.inStock}
            className="sketchy-button flex justify-center"
          >
            <ShoppingBag size={16} className="mr-1" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
