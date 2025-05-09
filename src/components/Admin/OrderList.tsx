
import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const OrderList = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (orders.length === 0) {
    return <p className="text-center py-10 font-comic-sans">No orders yet.</p>;
  }

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setShowViewDialog(true);
  };
  
  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
      setShowDeleteDialog(false);
      setOrderToDelete(null);
      
      // If we're viewing the deleted order, close the dialog
      if (viewingOrder && viewingOrder.id === orderToDelete.id) {
        setShowViewDialog(false);
        setViewingOrder(null);
      }
    }
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
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  {order.customer.name}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {order.total.toFixed(2)} pencils
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewOrder(order)}
                      className="font-comic-sans"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(order)}
                      className="text-red-500 hover:text-red-700 font-comic-sans"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateStatus(order.id, value as Order['status'])}
                    >
                      <SelectTrigger className="w-32 font-comic-sans">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl bg-[#c0c0c0] border border-[#808080]">
          <DialogHeader>
            <div className="window-header">
              <DialogTitle className="font-comic-sans">Order Details</DialogTitle>
              <span className="window-close" onClick={() => setShowViewDialog(false)}>×</span>
            </div>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#d0d0d0] border border-[#808080]">
                  <CardHeader>
                    <CardTitle className="font-comic-sans">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium font-comic-sans">Order ID:</dt>
                        <dd className="font-comic-sans">#{viewingOrder.id.slice(0, 8)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium font-comic-sans">Date:</dt>
                        <dd className="font-comic-sans">{new Date(viewingOrder.createdAt).toLocaleString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium font-comic-sans">Status:</dt>
                        <dd>
                          <Badge variant="outline" className={getStatusBadgeColor(viewingOrder.status)}>
                            {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                          </Badge>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium font-comic-sans">Total:</dt>
                        <dd className="font-bold font-comic-sans">{viewingOrder.total.toFixed(2)} pencils</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card className="bg-[#d0d0d0] border border-[#808080]">
                  <CardHeader>
                    <CardTitle className="font-comic-sans">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium font-comic-sans">Name:</dt>
                        <dd className="font-comic-sans">{viewingOrder.customer.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium font-comic-sans">Email:</dt>
                        <dd className="font-comic-sans">{viewingOrder.customer.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium font-comic-sans">Address:</dt>
                        <dd className="text-right font-comic-sans">{viewingOrder.customer.address}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#d0d0d0] border border-[#808080]">
                <CardHeader>
                  <CardTitle className="font-comic-sans">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="font-comic-sans">Product</TableHead>
                        <TableHead className="text-right font-comic-sans">Price</TableHead>
                        <TableHead className="text-right font-comic-sans">Qty</TableHead>
                        <TableHead className="text-right font-comic-sans">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingOrder.items.map((item) => (
                        <TableRow key={item.id} className="border-b">
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium font-comic-sans">{item.product.name}</div>
                                <div className="text-xs text-gray-500 font-comic-sans">{item.product.category}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-comic-sans">{item.product.price.toFixed(2)} pencils</TableCell>
                          <TableCell className="text-right font-comic-sans">{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium font-comic-sans">{(item.product.price * item.quantity).toFixed(2)} pencils</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2">
                        <TableCell colSpan={3} className="text-right font-bold font-comic-sans">Total:</TableCell>
                        <TableCell className="text-right font-bold font-comic-sans">{viewingOrder.total.toFixed(2)} pencils</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="destructive"
                  className="sketchy-button bg-red-500 text-white hover:bg-red-600 font-comic-sans"
                  onClick={() => handleDeleteClick(viewingOrder)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Order
                </Button>
                
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
                  <SelectTrigger className="w-40 font-comic-sans">
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#c0c0c0] border border-[#808080]">
          <AlertDialogHeader>
            <div className="window-header">
              <AlertDialogTitle className="font-comic-sans">Delete Order</AlertDialogTitle>
              <span className="window-close" onClick={() => setShowDeleteDialog(false)}>×</span>
            </div>
            <AlertDialogDescription className="font-comic-sans">
              Are you sure you want to delete order #{orderToDelete?.id.slice(0, 8)}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="sketchy-button font-comic-sans">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="sketchy-button bg-red-500 text-white hover:bg-red-600 font-comic-sans"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderList;
