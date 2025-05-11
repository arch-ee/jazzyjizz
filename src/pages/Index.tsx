
import ProductGrid from "../components/Products/ProductGrid";
import { useProducts } from "../context/ProductContext";
import Main from "../components/Layout/Main";
import { useEffect } from "react";

const Index = () => {
  const { products, loading } = useProducts();
  
  useEffect(() => {
    // Log to help debug rendering issues
    console.log("Index page rendering with", products.length, "products");
    console.log("Loading state:", loading);
  }, [products, loading]);

  return (
    <Main>
      <div className="container mx-auto px-2 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-lg mb-2">Loading products...</p>
              <div className="w-12 h-12 border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
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
