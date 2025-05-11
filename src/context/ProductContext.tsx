
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from '../hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../integrations/supabase/client';

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Sugar Sprinkle Delight",
    description: "Rainbow sprinkles coating a sweet marshmallow center. A classic favorite!",
    price: 2.99,
    image: "/placeholder.svg",
    inStock: true,
    stock: 50,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Chocolate Dream Bars",
    description: "Rich chocolate with caramel ribbons. Melt-in-your-mouth goodness.",
    price: 3.49,
    image: "/placeholder.svg",
    inStock: true,
    stock: 40,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Fruity Blast Chews",
    description: "Chewy candies bursting with fruit flavors. Perfect for a tangy treat!",
    price: 1.99,
    image: "/placeholder.svg",
    inStock: true,
    stock: 60,
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
  
  // Initialize with Supabase data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            currencies(*)
          `);

        if (error) {
          console.error('Error fetching products:', error);
          // If Supabase fetch fails, use initial data
          setProducts(initialProducts);
          return;
        }

        if (data && data.length > 0) {
          // Transform Supabase data to match our Product type
          const transformedProducts: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            inStock: item.instock,
            stock: item.stock,
            createdAt: new Date(item.created_at),
            currencies: item.currencies ? item.currencies.map((c: any) => ({
              type: c.type,
              amount: c.amount
            })) : []
          }));
          
          setProducts(transformedProducts);
        } else {
          // If no products in Supabase, initialize with sample data
          setInitialProducts();
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts(initialProducts);
      }
    };

    const setInitialProducts = async () => {
      // Add initial products to Supabase if empty
      for (const product of initialProducts) {
        try {
          const { data, error } = await supabase
            .from('products')
            .insert({
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              instock: product.inStock,
              stock: product.stock
            })
            .select();

          if (error) {
            console.error('Failed to add initial product:', error);
          }
        } catch (error) {
          console.error('Error adding initial product:', error);
        }
      }

      // Fetch after adding
      const { data } = await supabase.from('products').select('*, currencies(*)');
      
      if (data) {
        const transformedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          inStock: item.instock,
          stock: item.stock,
          createdAt: new Date(item.created_at),
          currencies: item.currencies ? item.currencies.map((c: any) => ({
            type: c.type,
            amount: c.amount
          })) : []
        }));
        
        setProducts(transformedProducts);
      }
    };

    fetchProducts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        async (payload) => {
          console.log('Change received!', payload);
          // Refetch all products when any change occurs
          const { data } = await supabase
            .from('products')
            .select(`*, currencies(*)`);
          
          if (data) {
            const transformedProducts: Product[] = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              image: item.image,
              inStock: item.instock,
              stock: item.stock,
              createdAt: new Date(item.created_at),
              currencies: item.currencies ? item.currencies.map((c: any) => ({
                type: c.type,
                amount: c.amount
              })) : []
            }));
            
            setProducts(transformedProducts);
            
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Product added",
                description: "A new product has been added to the inventory.",
              });
            } else if (payload.eventType === 'UPDATE') {
              toast({
                title: "Product updated",
                description: "A product has been updated in the inventory.",
              });
            } else if (payload.eventType === 'DELETE') {
              toast({
                title: "Product deleted",
                description: "A product has been removed from the inventory.",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    // Set inStock based on stock quantity
    const inStock = (productData.stock || 0) > 0;
    
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image || '/placeholder.svg',
          instock: inStock,
          stock: productData.stock || 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        toast({
          title: "Error",
          description: `Failed to add product: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Add currencies if provided
      if (productData.currencies && productData.currencies.length > 0) {
        const currencyPromises = productData.currencies.map(async (currency) => {
          return supabase
            .from('currencies')
            .insert({
              product_id: data.id,
              type: currency.type,
              amount: currency.amount
            });
        });

        await Promise.all(currencyPromises);
      }

      toast({
        title: "Product added",
        description: `${productData.name} has been added to your inventory.`,
      });

    } catch (error) {
      console.error('Failed to add product:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the product.",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // If stock is updated, also update inStock status
      const supabaseUpdates: any = {};
      
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.price !== undefined) supabaseUpdates.price = updates.price;
      if (updates.image !== undefined) supabaseUpdates.image = updates.image;
      if (updates.stock !== undefined) {
        supabaseUpdates.stock = updates.stock;
        supabaseUpdates.instock = updates.stock > 0;
      }
      if (updates.inStock !== undefined && updates.stock === undefined) {
        supabaseUpdates.instock = updates.inStock;
      }

      // Update in Supabase
      const { error } = await supabase
        .from('products')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Error",
          description: `Failed to update product: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Update currencies if provided
      if (updates.currencies) {
        // First, delete existing currencies
        await supabase
          .from('currencies')
          .delete()
          .eq('product_id', id);

        // Then add new currencies
        if (updates.currencies.length > 0) {
          const currencyInserts = updates.currencies.map(currency => ({
            product_id: id,
            type: currency.type,
            amount: currency.amount
          }));

          const { error: currencyError } = await supabase
            .from('currencies')
            .insert(currencyInserts);

          if (currencyError) {
            console.error('Error updating currencies:', currencyError);
          }
        }
      }

      toast({
        title: "Product updated",
        description: `The product has been successfully updated.`,
      });

    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the product.",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: `Failed to delete product: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const productToDelete = products.find(p => p.id === id);
      
      if (productToDelete) {
        toast({
          title: "Product deleted",
          description: `${productToDelete.name} has been removed from your inventory.`,
        });
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the product.",
        variant: "destructive",
      });
    }
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };
  
  // Update stock and return success status
  const updateStock = async (id: string, quantityChange: number): Promise<boolean> => {
    const product = products.find(p => p.id === id);
    if (!product) return false;
    
    // Check if enough stock is available
    if (product.stock + quantityChange < 0) return false;
    
    // Update stock
    const newStock = product.stock + quantityChange;
    const inStock = newStock > 0;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock: newStock,
          instock: inStock 
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating stock:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update stock:', error);
      return false;
    }
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
