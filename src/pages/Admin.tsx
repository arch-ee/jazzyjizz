
import { useState } from "react";
import AdminRoute from "../components/utils/AdminRoute";
import ProductForm from "../components/Admin/ProductForm";
import ProductList from "../components/Admin/ProductList";
import OrderList from "../components/Admin/OrderList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import Main from "../components/Layout/Main";
import { Plus } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);

  return (
    <AdminRoute>
      <Main>
        <div className="container mx-auto px-2 py-4">
          <div className="bg-[#c0c0c0] border border-[#808080] mb-4">
            <div className="window-header">
              <span className="font-comic-sans">Admin Panel</span>
              <span className="window-close">×</span>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-center mb-4">
                {activeTab === "products" && (
                  <Button 
                    className="sketchy-button font-comic-sans flex items-center"
                    onClick={() => setShowAddProductDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                )}
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="flex">
                  <TabsTrigger 
                    value="products" 
                    className="flex-1 sketchy-button data-[state=active]:bg-[#a0a0a0] font-comic-sans"
                  >
                    Products
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="flex-1 sketchy-button data-[state=active]:bg-[#a0a0a0] font-comic-sans"
                  >
                    Orders
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="bg-[#d0d0d0] p-3 border border-[#808080]">
                  <ProductList />
                </TabsContent>
                
                <TabsContent value="orders" className="bg-[#d0d0d0] p-3 border border-[#808080]">
                  <OrderList />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Add Product Dialog */}
          <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
            <DialogContent className="bg-[#c0c0c0] border border-[#808080] shadow-md max-w-2xl">
              <DialogHeader>
                <div className="window-header">
                  <DialogTitle className="font-comic-sans">Add New Product</DialogTitle>
                  <span className="window-close" onClick={() => setShowAddProductDialog(false)}>×</span>
                </div>
              </DialogHeader>
              <ProductForm 
                mode="create" 
                onSubmit={() => setShowAddProductDialog(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </Main>
    </AdminRoute>
  );
};

export default Admin;
