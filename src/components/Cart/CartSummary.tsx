
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';
import { Currency } from '../../types';

interface CartSummaryProps {
  onCheckout: () => void;
}

const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { subtotal, totalItems, cart } = useCart();
  
  // Calculate totals for all currencies
  const currencyTotals: Record<string, number> = {};
  
  cart.forEach(item => {
    // Add alternative currencies
    if (item.product.currencies && item.product.currencies.length > 0) {
      item.product.currencies.forEach(currency => {
        const currencyAmount = currency.amount * item.quantity;
        if (currencyTotals[currency.type]) {
          currencyTotals[currency.type] += currencyAmount;
        } else {
          currencyTotals[currency.type] = currencyAmount;
        }
      });
    }
  });

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span>{subtotal.toFixed(2)} pencils</span>
        </div>
        
        {/* Display all other currencies */}
        {Object.entries(currencyTotals).map(([type, amount]) => (
          <div className="flex justify-between" key={type}>
            <span className="text-gray-600">{type}</span>
            <span>{amount.toFixed(2)}</span>
          </div>
        ))}
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{subtotal.toFixed(2)} pencils</span>
          </div>
          
          {/* Display all other currency totals */}
          {Object.entries(currencyTotals).map(([type, amount]) => (
            <div className="flex justify-between text-sm" key={`total-${type}`}>
              <span></span>
              <span>+ {amount.toFixed(2)} {type}</span>
            </div>
          ))}
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
