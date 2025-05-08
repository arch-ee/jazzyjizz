
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';

interface CartSummaryProps {
  onCheckout: () => void;
}

const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { subtotal, totalItems } = useCart();
  const total = subtotal; // No shipping or tax

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span>{subtotal.toFixed(2)} pencils</span>
        </div>
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{total.toFixed(2)} pencils</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full mt-6 sketchy-button" 
        onClick={onCheckout}
        disabled={totalItems === 0}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
