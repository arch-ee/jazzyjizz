
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem, CustomerOrders } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../hooks/use-toast';
import { useProducts } from './ProductContext';

type OrderContextType = {
  orders: Order[];
  addOrder: (customerInfo: { name: string; email: string; address: string }, items: CartItem[], total: number) => Order | null;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  hasReachedDailyLimit: (customerName: string) => boolean;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrders>({});
  const { toast } = useToast();
  const { updateStock } = useProducts();

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        // Parse the date strings back to Date objects
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }));
        setOrders(parsedOrders);
        
        // Initialize customer orders tracking
        initializeCustomerOrders(parsedOrders);
      } catch (error) {
        console.error('Failed to parse saved orders', error);
      }
    }
  }, []);

  // Initialize customer orders from existing orders
  const initializeCustomerOrders = (orderList: Order[]) => {
    const today = new Date().toDateString();
    const customerTracker: CustomerOrders = {};
    
    orderList.forEach(order => {
      const customerName = order.customer.name;
      const orderDate = new Date(order.createdAt).toDateString();
      
      // Only count orders from today
      if (orderDate === today) {
        if (!customerTracker[customerName]) {
          customerTracker[customerName] = { count: 1, lastOrderDate: orderDate };
        } else {
          customerTracker[customerName].count += 1;
          customerTracker[customerName].lastOrderDate = orderDate;
        }
      }
    });
    
    setCustomerOrders(customerTracker);
  };

  // Save orders to localStorage
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Check if customer has reached daily order limit (2 per day)
  const hasReachedDailyLimit = (customerName: string): boolean => {
    const today = new Date().toDateString();
    
    if (!customerOrders[customerName]) return false;
    
    return customerOrders[customerName].lastOrderDate === today && 
           customerOrders[customerName].count >= 2;
  };

  // Round up pencils for the total
  const roundUpTotal = (total: number): number => {
    return Math.ceil(total);
  };

  const addOrder = (customerInfo: { name: string; email: string; address: string }, items: CartItem[], total: number): Order | null => {
    // Check daily limit
    if (hasReachedDailyLimit(customerInfo.name)) {
      toast({
        title: "Order limit reached",
        description: "You've reached the limit of 2 orders per day.",
        variant: "destructive"
      });
      return null;
    }
    
    // Check stock availability
    for (const item of items) {
      const product = item.product;
      if (!product.inStock || product.stock < item.quantity) {
        toast({
          title: "Insufficient stock",
          description: `Not enough ${product.name} in stock.`,
          variant: "destructive"
        });
        return null;
      }
    }
    
    // Round up the total for pencils
    const roundedTotal = roundUpTotal(total);
    
    const newOrder: Order = {
      id: uuidv4(),
      customer: customerInfo,
      items,
      status: 'pending',
      total: roundedTotal,
      createdAt: new Date()
    };
    
    // Update stock for all items
    items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });
    
    // Update orders state
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    // Update customer order tracking
    setCustomerOrders(prev => {
      const today = new Date().toDateString();
      const customerName = customerInfo.name;
      
      if (!prev[customerName]) {
        return {
          ...prev,
          [customerName]: { count: 1, lastOrderDate: today }
        };
      } else if (prev[customerName].lastOrderDate === today) {
        return {
          ...prev,
          [customerName]: { 
            count: prev[customerName].count + 1, 
            lastOrderDate: today 
          }
        };
      } else {
        // Reset count if it's a different day
        return {
          ...prev,
          [customerName]: { count: 1, lastOrderDate: today }
        };
      }
    });
    
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
  
  const deleteOrder = (id: string) => {
    const orderToDelete = orders.find(order => order.id === id);
    if (!orderToDelete) return;
    
    // Return items to stock if order is deleted
    orderToDelete.items.forEach(item => {
      updateStock(item.productId, item.quantity);
    });
    
    setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    
    toast({
      title: "Order deleted",
      description: `Order #${id.slice(0, 8)} has been removed.`,
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
      deleteOrder,
      getOrder,
      hasReachedDailyLimit
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
