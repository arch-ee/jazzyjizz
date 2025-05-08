
import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const OrderList = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  if (orders.length === 0) {
    return <p className="text-center py-10">No orders yet.</p>;
  }

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setShowViewDialog(true);
  };

  const getStatusBadgeColor = (status: Order['status']) => {
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

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-4">
                  {order.customer.name}
                </td>
                <td className="px-4 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <Badge variant="outline" className={getStatusBadgeColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </Button>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateStatus(order.id, value as Order['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Order ID:</dt>
                        <dd>#{viewingOrder.id.slice(0, 8)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Date:</dt>
                        <dd>{new Date(viewingOrder.createdAt).toLocaleString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Status:</dt>
                        <dd>
                          <Badge variant="outline" className={getStatusBadgeColor(viewingOrder.status)}>
                            {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                          </Badge>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Total:</dt>
                        <dd className="font-bold">${viewingOrder.total.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Name:</dt>
                        <dd>{viewingOrder.customer.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Email:</dt>
                        <dd>{viewingOrder.customer.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Address:</dt>
                        <dd className="text-right">{viewingOrder.customer.address}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2 text-left">Product</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-right">Qty</th>
                        <th className="py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingOrder.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{item.product.name}</div>
                                <div className="text-xs text-gray-500">{item.product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-right">${item.product.price.toFixed(2)}</td>
                          <td className="py-3 text-right">{item.quantity}</td>
                          <td className="py-3 text-right font-medium">${(item.product.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2">
                        <td colSpan={3} className="py-3 text-right font-bold">Total:</td>
                        <td className="py-3 text-right font-bold">${viewingOrder.total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Select
                  value={viewingOrder.status}
                  onValueChange={(value) => {
                    handleUpdateStatus(viewingOrder.id, value as Order['status']);
                    setViewingOrder({
                      ...viewingOrder,
                      status: value as Order['status']
                    });
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
