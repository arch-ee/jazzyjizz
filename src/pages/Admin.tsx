
import { useState } from "react";
import AdminRoute from "../components/utils/AdminRoute";
import ProductForm from "../components/Admin/ProductForm";
import ProductList from "../components/Admin/ProductList";
import OrderList from "../components/Admin/OrderList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import Main from "../components/Layout/Main";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);

  return (
    <AdminRoute>
      <Main>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your candy store</p>
            </div>
            
            {activeTab === "products" && (
              <Button 
                className="mt-4 md:mt-0 bg-gradient-to-r from-candy-purple to-candy-pink hover:from-candy-pink hover:to-candy-purple"
                onClick={() => setShowAddProductDialog(true)}
              >
                Add New Product
              </Button>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="candy-card p-6">
              <ProductList />
            </TabsContent>
            
            <TabsContent value="orders" className="candy-card p-6">
              <OrderList />
            </TabsContent>
          </Tabs>
          
          {/* Add Product Dialog */}
          <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
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
