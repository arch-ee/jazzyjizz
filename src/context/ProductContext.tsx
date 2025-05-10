
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from '../hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../firebase/config';
import { ref, onValue, set, remove, update } from 'firebase/database';

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Sugar Sprinkle Delight",
    description: "Rainbow sprinkles coating a sweet marshmallow center. A classic favorite!",
    price: 2.99,
    image: "/placeholder.svg",
    inStock: true,
    stock: 50, // Added initial stock
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Chocolate Dream Bars",
    description: "Rich chocolate with caramel ribbons. Melt-in-your-mouth goodness.",
    price: 3.49,
    image: "/placeholder.svg",
    inStock: true,
    stock: 40, // Added initial stock
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Fruity Blast Chews",
    description: "Chewy candies bursting with fruit flavors. Perfect for a tangy treat!",
    price: 1.99,
    image: "/placeholder.svg",
    inStock: true,
    stock: 60, // Added initial stock
    createdAt: new Date(),
  },
];

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  updateStock: (id: string, quantityChange: number) => boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const productsRef = ref(database, 'products');

  // Initialize Firebase with data from localStorage if Firebase is empty
  useEffect(() => {
    const loadInitialData = async () => {
      // Listen for changes in Firebase
      onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productsArray = Object.values(data).map((product: any) => ({
            ...product,
            createdAt: new Date(product.createdAt)
          }));
          setProducts(productsArray as Product[]);
        } else {
          // If no data in Firebase, load from localStorage or use initial data
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            try {
              const parsedProducts = JSON.parse(savedProducts).map((product: any) => ({
                ...product,
                createdAt: new Date(product.createdAt),
                // Ensure stock property exists
                stock: product.stock || 0
              }));
              
              // Initialize Firebase with saved products
              parsedProducts.forEach((product: Product) => {
                set(ref(database, `products/${product.id}`), {
                  ...product,
                  createdAt: product.createdAt.toISOString()
                });
              });
              
              setProducts(parsedProducts);
            } catch (error) {
              console.error('Failed to parse saved products', error);
              initializeWithDefaultProducts();
            }
          } else {
            initializeWithDefaultProducts();
          }
        }
      });
    };

    const initializeWithDefaultProducts = () => {
      // Initialize with default products
      initialProducts.forEach(product => {
        set(ref(database, `products/${product.id}`), {
          ...product,
          createdAt: product.createdAt.toISOString()
        });
      });
      setProducts(initialProducts);
    };

    loadInitialData();
  }, []);

  // Save products to localStorage as a backup
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const productId = uuidv4();
    
    // Set inStock based on stock quantity
    const inStock = (productData.stock || 0) > 0;
    
    const newProduct: Product = {
      ...productData,
      id: productId,
      inStock,
      createdAt: new Date()
    };
    
    // Add to Firebase
    set(ref(database, `products/${productId}`), {
      ...newProduct,
      createdAt: newProduct.createdAt.toISOString()
    });
    
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added to your inventory.`,
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const productRef = ref(database, `products/${id}`);
    
    // If stock is updated, also update inStock status
    if (updates.stock !== undefined) {
      updates.inStock = updates.stock > 0;
    }
    
    // Update in Firebase
    update(productRef, {
      ...updates,
      createdAt: updates.createdAt ? updates.createdAt.toISOString() : undefined
    });
    
    toast({
      title: "Product updated",
      description: `The product has been successfully updated.`,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    
    // Delete from Firebase
    remove(ref(database, `products/${id}`));
    
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
  
  // New function to update stock and return success status
  const updateStock = (id: string, quantityChange: number): boolean => {
    const product = products.find(p => p.id === id);
    if (!product) return false;
    
    // Check if enough stock is available
    if (product.stock + quantityChange < 0) return false;
    
    // Update stock
    const newStock = product.stock + quantityChange;
    const inStock = newStock > 0;
    
    updateProduct(id, { stock: newStock, inStock });
    return true;
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      updateStock,
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
