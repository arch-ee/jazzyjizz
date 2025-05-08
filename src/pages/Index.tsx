
import ProductGrid from "../components/Products/ProductGrid";
import { useProducts } from "../context/ProductContext";
import Main from "../components/Layout/Main";

const Index = () => {
  const { products } = useProducts();

  return (
    <Main>
      <div className="container mx-auto px-2 py-4">
        <div className="mb-4 bg-[#c0c0c0] border border-[#808080] p-3">
          <div className="window-header">
            <span>Products</span>
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
