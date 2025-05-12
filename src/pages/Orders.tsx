import { useState, useEffect } from "react";
import { useOrders } from "../context/OrderContext";
import Main from "../components/Layout/Main";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Loader2 } from "lucide-react";

const Orders = () => {
  const { orders, loading, cancelOrder } = useOrders();
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    // Get customer name from localStorage if exists
    const savedName = localStorage.getItem("customer_name");
    if (savedName) {
      setCustomerName(savedName);
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("customer_name", customerName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!customerName) {
    return (
      <Main>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
              <form onSubmit={handleNameSubmit}>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-2 border rounded mb-4"
                  required
                />
                <Button type="submit" className="w-full sketchy-button">
                  View Orders
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Main>
    );
  }

  const customerOrders = orders.filter(order => 
    order.customer.name.toLowerCase() === customerName.toLowerCase()
  );

  return (
    <Main>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#c0c0c0] border border-[#808080] p-4">
          <div className="window-header mb-4">
            <h1 className="text-xl font-bold">Your Orders</h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : customerOrders.length === 0 ? (
            <div className="text-center py-8">
              <p>No orders found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="ml-4">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {(item.product.price * item.quantity).toFixed(2)} pencils
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Total:</p>
                      <p className="font-bold">{order.total.toFixed(2)} pencils</p>
                    </div>
                    {order.status === 'pending' && (
                      <Button
                        variant="destructive"
                        className="mt-4 w-full sketchy-button"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
};

export default Orders;