
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

const App = () => {
  console.log("App rendering, using HashRouter for better GitHub Pages compatibility");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {/* Using HashRouter instead of BrowserRouter for GitHub Pages */}
                <HashRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </HashRouter>
              </TooltipProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
