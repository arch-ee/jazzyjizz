
import { useCart } from '../../context/CartContext';
import { CartItem as CartItemType } from '../../types';
import { Button } from '../ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{item.product.name}</h3>
          <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">{item.product.description.substring(0, 50)}...</p>
        
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleDecrement}
            >
              <Minus size={14} />
            </Button>
            <span className="mx-2 w-8 text-center">{item.quantity}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleIncrement}
            >
              <Plus size={14} />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50" 
            onClick={handleRemove}
          >
            <Trash2 size={16} />
            <span className="ml-1">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
