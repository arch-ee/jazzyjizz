
import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Card } from '../ui/card';
import ProductForm from './ProductForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

const ProductList = () => {
  const { products, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditDialog(true);
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setShowViewDialog(true);
  };

  const handleEditComplete = () => {
    setShowEditDialog(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
  };

  if (products.length === 0) {
    return <p className="text-center py-10 font-comic-sans">No products available. Add some candy!</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="font-comic-sans">
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Currencies</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50 font-comic-sans">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">${product.price.toFixed(2)}</td>
                <td className="px-4 py-4">
                  {product.currencies && product.currencies.length > 0 ? (
                    <div className="text-xs">
                      {product.currencies.map((currency, index) => (
                        <span key={index} className="mr-1">
                          {currency.amount} {currency.type}{index < product.currencies!.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleView(product)}
                      className="font-comic-sans"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(product)}
                      className="font-comic-sans"
                    >
                      <Pencil size={16} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 font-comic-sans"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="font-comic-sans">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {product.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl font-comic-sans">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm 
              product={editingProduct} 
              mode="edit" 
              onSubmit={handleEditComplete} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl font-comic-sans">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <Card className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="w-full h-full object-cover"
                />
                {!viewingProduct.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <p className="text-white font-semibold text-lg">Out of Stock</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{viewingProduct.name}</h3>
                <p className="mt-4">{viewingProduct.description}</p>
                <p className="mt-4 text-lg font-bold">${viewingProduct.price.toFixed(2)}</p>
                
                {viewingProduct.currencies && viewingProduct.currencies.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold">Alternative Currencies:</p>
                    <ul className="mt-1 list-disc list-inside">
                      {viewingProduct.currencies.map((currency, index) => (
                        <li key={index}>{currency.amount} {currency.type}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewingProduct.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Added on: {new Date(viewingProduct.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
