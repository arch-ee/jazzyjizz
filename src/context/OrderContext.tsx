import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../hooks/use-toast';
import { useProducts } from './ProductContext';
import { supabase } from '../integrations/supabase/client';

type OrderContextType = {
  orders: Order[];
  addOrder: (customerInfo: { name: string; email: string; address: string }, items: CartItem[], total: number) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const { updateStock } = useProducts();

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            quantity,
            price,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      if (ordersData) {
        const transformedOrders: Order[] = ordersData.map(order => ({
          id: order.id,
          customer: {
            name: order.customer_name,
            email: order.email || '',
            address: order.address || ''
          },
          items: order.items.map((item: any) => ({
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
            product: item.product
          })),
          status: order.status,
          total: order.total,
          createdAt: new Date(order.created_at)
        }));

        setOrders(transformedOrders);
      }
    };

    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addOrder = async (
    customerInfo: { name: string; email: string; address: string },
    items: CartItem[],
    total: number
  ): Promise<Order | null> => {
    try {
      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerInfo.name,
          email: customerInfo.email,
          address: customerInfo.address,
          total: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update stock for all items
      for (const item of items) {
        await updateStock(item.productId, -item.quantity);
      }

      toast({
        title: "Order placed",
        description: `Order #${orderData.id.slice(0, 8)} has been placed successfully!`,
      });

      return {
        id: orderData.id,
        customer: customerInfo,
        items,
        status: 'pending',
        total,
        createdAt: new Date(orderData.created_at)
      };
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, status } : order
        )
      );

      toast({
        title: "Order updated",
        description: `Order #${id.slice(0, 8)} status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const order = orders.find(o => o.id === id);
      if (!order) return;

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Return items to stock
      for (const item of order.items) {
        await updateStock(item.productId, item.quantity);
      }

      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));

      toast({
        title: "Order deleted",
        description: `Order #${id.slice(0, 8)} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    }
  };

  const getOrder = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      getOrder,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};