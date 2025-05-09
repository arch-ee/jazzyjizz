
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from '../hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Sugar Sprinkle Delight",
    description: "Rainbow sprinkles coating a sweet marshmallow center. A classic favorite!",
    price: 2.99,
    image: "/placeholder.svg",
    category: "Sweets",
    inStock: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Chocolate Dream Bars",
    description: "Rich chocolate with caramel ribbons. Melt-in-your-mouth goodness.",
    price: 3.49,
    image: "/placeholder.svg",
    category: "Chocolate",
    inStock: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Fruity Blast Chews",
    description: "Chewy candies bursting with fruit flavors. Perfect for a tangy treat!",
    price: 1.99,
    image: "/placeholder.svg",
    category: "Chewy",
    inStock: true,
    createdAt: new Date(),
  },
];

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Load products from localStorage or use initial data
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        // Parse the date strings back to Date objects
        const parsedProducts = JSON.parse(savedProducts).map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt)
        }));
        setProducts(parsedProducts);
      } catch (error) {
        console.error('Failed to parse saved products', error);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // Save products to localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added to your inventory.`,
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
    
    toast({
      title: "Product updated",
      description: `The product has been successfully updated.`,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    
    if (productToDelete) {
      toast({
        title: "Product deleted",
        description: `${productToDelete.name} has been removed from your inventory.`,
      });
    }
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
