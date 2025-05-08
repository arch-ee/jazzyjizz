
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import CartItem from "../components/Cart/CartItem";
import CartSummary from "../components/Cart/CartSummary";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import Main from "../components/Layout/Main";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, clearCart, subtotal } = useCart();
  const { addOrder } = useOrders();
  
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckout = () => {
    setShowCheckoutDialog(true);
  };
  
  const handlePlaceOrder = () => {
    const shipping = subtotal > 35 ? 0 : 4.99;
    const tax = subtotal * 0.07;
    const total = subtotal + shipping + tax;
    
    const order = addOrder(customerInfo, cart, total);
    setOrderId(order.id);
    
    setShowCheckoutDialog(false);
    setShowConfirmationDialog(true);
    clearCart();
  };
  
  if (cart.length === 0) {
    return (
      <Main>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Your Candy Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Let's add some sweet treats to your cart!</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-candy-pink to-candy-purple hover:from-candy-purple hover:to-candy-pink">
                Browse Candies
              </Button>
            </Link>
          </div>
        </div>
      </Main>
    );
  }
  
  return (
    <Main>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Candy Cart</h1>
        
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
            
            <div className="mt-6 candy-card p-6">
              <h3 className="text-lg font-medium mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Have questions about our candy or the ordering process? We're here to help!
              </p>
              <p className="text-sm text-gray-500">
                Contact us at: <br />
                <strong>Email:</strong> support@candycarnival.com <br />
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>
          </div>
        </div>
        
        {/* Checkout Dialog */}
        <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Order</DialogTitle>
              <DialogDescription>
                Please provide your information to complete your candy order.
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="123 Candy Lane, Sweet City, SC 12345"
                  required
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCheckoutDialog(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-gradient-to-r from-candy-pink to-candy-red hover:from-candy-red hover:to-candy-pink"
                onClick={handlePlaceOrder}
                disabled={!customerInfo.name || !customerInfo.email || !customerInfo.address}
              >
                Place Order
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
                <p className="font-medium">Thank you for your sweet order!</p>
                <p className="text-sm mt-1">
                  Your order #{orderId.slice(0, 8)} has been received and is being processed.
                </p>
              </div>
              
              <p className="text-gray-600 mb-2">
                We've sent a confirmation email to {customerInfo.email} with all the details.
              </p>
              
              <p className="text-gray-600">
                Your delicious candies will be on their way to you soon!
              </p>
            </div>
            
            <DialogFooter>
              <Link to="/" className="w-full">
                <Button className="w-full">
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
