
import ProductGrid from "../components/Products/ProductGrid";
import { useProducts } from "../context/ProductContext";
import Main from "../components/Layout/Main";
import { useEffect } from "react";

const Index = () => {
  const { products } = useProducts();
  
  useEffect(() => {
    // Log to help debug rendering issues
    console.log("Index page rendering with", products.length, "products");
  }, [products]);

  return (
    <Main>
      <div className="container mx-auto px-2 py-4">
        <div className="mb-4 bg-[#c0c0c0] border border-[#808080] p-3">
          <div className="window-header">
            <span>Explore Products</span>
            <span className="window-close">×</span>
          </div>
          <div className="p-2">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
