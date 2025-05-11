
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import CartItem from "../components/Cart/CartItem";
import CartSummary from "../components/Cart/CartSummary";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Main from "../components/Layout/Main";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

const Cart = () => {
  const { cart, clearCart, subtotal } = useCart();
  const { addOrder, hasReachedDailyLimit } = useOrders();
  const { toast } = useToast();
  
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckout = () => {
    setShowCheckoutDialog(true);
  };
  
  const handlePlaceOrder = async () => {
    // Check if customer has reached daily order limit
    if (customerInfo.name && hasReachedDailyLimit(customerInfo.name)) {
      toast({
        title: "Order limit reached",
        description: "You've reached the limit of 2 orders per day.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    const total = subtotal;
    
    // Create a simplified customer info object with just the name
    const simplifiedCustomerInfo = {
      name: customerInfo.name,
      email: "", // Empty string as we're removing this field
      address: "", // Empty string as we're removing this field
    };
    
    // Place the order with async stock updates
    try {
      const order = addOrder(simplifiedCustomerInfo, cart, total);
      
      if (order) {
        setOrderId(order.id);
        setShowCheckoutDialog(false);
        setShowConfirmationDialog(true);
        clearCart();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <Main>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart</p>
            <Link to="/">
              <Button className="sketchy-button">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </Main>
    );
  }

  // Check if any items have insufficient stock
  const insufficientStockItems = cart.filter(item => 
    item.quantity > (item.product.stock || 0)
  );
  
  return (
    <Main>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {insufficientStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-md">
            <h3 className="font-bold mb-2">Stock Warning</h3>
            <p>The following items have insufficient stock:</p>
            <ul className="list-disc list-inside mt-2">
              {insufficientStockItems.map(item => (
                <li key={item.id}>
                  {item.product.name} - Requested: {item.quantity}, Available: {item.product.stock || 0}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="candy-card p-6">
              <div className="space-y-6">
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
        
        {/* Checkout Dialog */}
        <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Order</DialogTitle>
              <DialogDescription>
                Please provide your name to complete your order.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
                <p className="text-xs text-gray-500">
                  Note: Maximum 2 orders per customer per day
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCheckoutDialog(false)}
                className="mr-2"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="sketchy-button"
                onClick={handlePlaceOrder}
                disabled={!customerInfo.name || insufficientStockItems.length > 0 || isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Order Confirmation Dialog */}
        <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Confirmed!</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
                <p className="font-medium">Thank you for your order!</p>
                <p className="text-sm mt-1">
                  Your order #{orderId.slice(0, 8)} has been received and is being processed.
                </p>
              </div>
              
              <p className="text-gray-600">
                Your products will be shipped soon.
              </p>
            </div>
            
            <DialogFooter>
              <Link to="/" className="w-full">
                <Button className="w-full sketchy-button">
                  Continue Shopping
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Main>
  );
};

export default Cart;
