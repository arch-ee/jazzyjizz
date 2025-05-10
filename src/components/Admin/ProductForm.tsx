
import { useState } from 'react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ProductFormProps {
  product?: Product;
  onSubmit?: () => void;
  mode: 'create' | 'edit';
}

interface Currency {
  type: string;
  amount: number;
}

const ProductForm = ({ product, onSubmit, mode }: ProductFormProps) => {
  const { addProduct, updateProduct } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const initialCurrencies = product?.currencies || [];
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    image: product?.image || '/placeholder.svg',
    inStock: product?.inStock !== undefined ? product.inStock : true,
    stock: product?.stock || 0, // Added stock field
  });

  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (checked: boolean) => {
    // If checked, set inStock to true and set stock to 1 if it was 0
    // If unchecked, set inStock to false and set stock to 0
    const newStock = checked ? (formData.stock > 0 ? formData.stock : 1) : 0;
    setFormData(prev => ({ 
      ...prev, 
      inStock: checked,
      stock: newStock
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, price: isNaN(value) ? 0 : value }));
  };
  
  const handleStockNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const stockValue = isNaN(value) ? 0 : Math.max(0, value);
    const isInStock = stockValue > 0;
    
    setFormData(prev => ({ 
      ...prev, 
      stock: stockValue,
      inStock: isInStock
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCurrency = () => {
    setCurrencies([...currencies, { type: 'pencil', amount: 1 }]);
  };

  const handleRemoveCurrency = (index: number) => {
    const updatedCurrencies = [...currencies];
    updatedCurrencies.splice(index, 1);
    setCurrencies(updatedCurrencies);
  };

  const handleCurrencyChange = (index: number, field: 'type' | 'amount', value: string | number) => {
    const updatedCurrencies = [...currencies];
    
    if (field === 'amount') {
      // Round up currency amount to whole numbers
      value = Math.ceil(Number(value));
    }
    
    updatedCurrencies[index] = { 
      ...updatedCurrencies[index], 
      [field]: field === 'amount' ? Number(value) : value 
    };
    setCurrencies(updatedCurrencies);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare product data with currencies
      const productData = {
        ...formData,
        currencies: currencies,
        image: imagePreview || formData.image, // Use the image preview if available
        // Make sure inStock is based on stock quantity
        inStock: formData.stock > 0
      };

      if (mode === 'create') {
        addProduct(productData);
      } else if (mode === 'edit' && product) {
        updateProduct(product.id, productData);
      }
      
      if (onSubmit) onSubmit();

      if (mode === 'create') {
        // Reset form if creating
        setFormData({
          name: '',
          description: '',
          price: 0,
          image: '/placeholder.svg',
          inStock: true,
          stock: 0,
        });
        setCurrencies([]);
        setImageFile(null);
        setImagePreview('');
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currencyTypes = ["pencil", "gluestick", "scissors", "lead", "eraser", "ruler", "crayon"];

  return (
    <Card className="bg-[#d0d0d0] border border-[#808080]">
      <CardHeader>
        <CardTitle className="font-comic-sans">{mode === 'create' ? 'Add New Product' : 'Edit Product'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-comic-sans">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              className="font-comic-sans bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="font-comic-sans">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              rows={3}
              required
              className="font-comic-sans bg-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="font-comic-sans">Price (pencils)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handlePriceChange}
                min="0"
                step="0.01"
                required
                className="font-comic-sans bg-white"
              />
            </div>
            
            {/* Add stock quantity input */}
            <div className="space-y-2">
              <Label htmlFor="stock" className="font-comic-sans">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleStockNumberChange}
                min="0"
                step="1"
                required
                className="font-comic-sans bg-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="font-comic-sans">Alternative Currencies</Label>
              <Button 
                type="button" 
                onClick={handleAddCurrency}
                className="sketchy-button flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="font-comic-sans">Add</span>
              </Button>
            </div>
            
            {currencies.map((currency, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2 bg-white p-2 rounded-md">
                <Select 
                  value={currency.type}
                  onValueChange={(value) => handleCurrencyChange(index, 'type', value)}
                >
                  <SelectTrigger className="w-full font-comic-sans">
                    <SelectValue placeholder="Currency Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={currency.amount}
                  onChange={(e) => handleCurrencyChange(index, 'amount', e.target.value)}
                  min="1"
                  className="w-20 font-comic-sans bg-white"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleRemoveCurrency(index)}
                  className="sketchy-button text-red-500 hover:text-red-700 flex items-center"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image" className="font-comic-sans">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="font-comic-sans bg-white"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {imagePreview && (
                <div className="bg-white p-2 rounded-md border border-[#808080]">
                  <p className="mb-1 font-comic-sans">Preview:</p>
                  <div className="h-32 flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full object-contain" 
                    />
                  </div>
                </div>
              )}
              
              {!imagePreview && formData.image && (
                <div className="bg-white p-2 rounded-md border border-[#808080]">
                  <p className="mb-1 font-comic-sans">Current Image:</p>
                  <div className="h-32 flex items-center justify-center">
                    <img 
                      src={formData.image} 
                      alt="Current" 
                      className="h-full object-contain" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-white p-3 rounded-md">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={handleStockChange}
            />
            <Label htmlFor="inStock" className="font-comic-sans">In Stock</Label>
            <div className="text-sm text-gray-500 ml-auto">
              {formData.inStock ? 
                `${formData.stock} items available` : 
                "Out of stock"}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full sketchy-button font-comic-sans flex items-center justify-center"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : mode === 'create' ? 'Add Product' : 'Update Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
