
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';

interface CartSummaryProps {
  onCheckout: () => void;
}

const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { subtotal, totalItems } = useCart();
  const shipping = subtotal > 35 ? 0 : 4.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>${shipping.toFixed(2)}</span>
          )}
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full mt-6 bg-gradient-to-r from-candy-pink to-candy-red hover:from-candy-red hover:to-candy-pink" 
        onClick={onCheckout}
        disabled={totalItems === 0}
      >
        Proceed to Checkout
      </Button>
      
      {shipping > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Add ${(35 - subtotal).toFixed(2)} more to qualify for free shipping!
        </p>
      )}
    </div>
  );
};

export default CartSummary;
