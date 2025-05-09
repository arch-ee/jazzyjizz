
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from '../hooks/use-toast';

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('candy-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart', error);
      }
    }
  }, []);
  
  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('candy-cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        const updatedCart = prevCart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast({
          title: "Cart updated",
          description: `Added more ${product.name} to your cart!`,
        });
        return updatedCart;
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart!`,
        });
        return [...prevCart, {
          id: Date.now().toString(),
          productId: product.id,
          quantity,
          product,
        }];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === itemId);
      if (item) {
        toast({
          title: "Item removed",
          description: `${item.product.name} removed from your cart.`,
        });
      }
      return prevCart.filter(item => item.id !== itemId);
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
