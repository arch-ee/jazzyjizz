import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../hooks/use-toast';

type OrderContextType = {
  orders: Order[];
  addOrder: (customerInfo: { name: string; email: string; address: string }, items: CartItem[], total: number) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrder: (id: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('candy-orders');
    if (savedOrders) {
      try {
        // Parse the date strings back to Date objects
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Failed to parse saved orders', error);
      }
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('candy-orders', JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (customerInfo: { name: string; email: string; address: string }, items: CartItem[], total: number): Order => {
    const newOrder: Order = {
      id: uuidv4(),
      customer: customerInfo,
      items,
      status: 'pending',
      total,
      createdAt: new Date()
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    toast({
      title: "Order placed",
      description: `Order #${newOrder.id.slice(0, 8)} has been placed successfully!`,
    });
    
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Order updated",
      description: `Order #${id.slice(0, 8)} status changed to ${status}.`,
    });
  };

  const getOrder = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
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
