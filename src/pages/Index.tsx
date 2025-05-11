
import ProductGrid from "../components/Products/ProductGrid";
import { useProducts } from "../context/ProductContext";
import Main from "../components/Layout/Main";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const { products, loading } = useProducts();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Log to help debug rendering issues
    console.log("Index page rendering with", products.length, "products");
    console.log("Loading state:", loading);
    
    // Set timeout to detect if products don't load within 10 seconds
    const timer = setTimeout(() => {
      if (loading && products.length === 0) {
        console.error("Products failed to load within timeout period");
        setHasError(true);
      }
    }, 10000);
    
    // Mark component as loaded after initial render
    setIsLoaded(true);
    
    return () => clearTimeout(timer);
  }, [products, loading]);

  // Force a re-render if stuck in loading state
  useEffect(() => {
    if (isLoaded && loading && products.length === 0) {
      const forceRefresh = setTimeout(() => {
        window.location.reload();
      }, 15000);
      
      return () => clearTimeout(forceRefresh);
    }
  }, [isLoaded, loading, products]);

  // Handle errors
  if (hasError) {
    return (
      <Main>
        <div className="container mx-auto px-2 py-4">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
            <p className="mb-4">We're having trouble loading the product data.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </Main>
    );
  }

  return (
    <Main>
      <div className="container mx-auto px-2 py-4">
        {loading ? (
          <div className="mb-4 bg-[#c0c0c0] border border-[#808080] p-3">
            <div className="window-header">
              <span>Loading Products...</span>
              <span className="window-close">×</span>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="sketchy-card">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-2 bg-[#c0c0c0]">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 bg-[#c0c0c0] border border-[#808080] p-3">
            <div className="window-header">
              <span>Explore Products</span>
              <span className="window-close">×</span>
            </div>
            <div className="p-2">
              <ProductGrid products={products} />
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default Index;
