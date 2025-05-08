
import { useState } from 'react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

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
  });

  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, inStock: checked }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, price: isNaN(value) ? 0 : value }));
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
        image: imagePreview || formData.image // Use the image preview if available
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
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Product' : 'Edit Product'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sugar Sprinkle Delights"
              required
              className="font-comic-sans"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Delicious sugar sprinkles that melt in your mouth..."
              rows={3}
              required
              className="font-comic-sans"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handlePriceChange}
                min="0"
                step="0.01"
                required
                className="font-comic-sans"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Alternative Currency</Label>
            {currencies.map((currency, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select 
                  value={currency.type}
                  onChange={(e) => handleCurrencyChange(index, 'type', e.target.value)}
                  className="bg-[#c0c0c0] border border-t-white border-l-white border-b-[#808080] border-r-[#808080] h-10 rounded p-2 font-comic-sans"
                >
                  {currencyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={currency.amount}
                  onChange={(e) => handleCurrencyChange(index, 'amount', e.target.value)}
                  min="1"
                  className="w-20 font-comic-sans"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleRemoveCurrency(index)}
                  className="sketchy-button"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              onClick={handleAddCurrency}
              className="sketchy-button mt-2"
            >
              Add Currency
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="font-comic-sans"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="mb-1 font-comic-sans">Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 object-contain border border-[#808080]" 
                />
              </div>
            )}
            {!imagePreview && formData.image && (
              <div className="mt-2">
                <p className="mb-1 font-comic-sans">Current Image:</p>
                <img 
                  src={formData.image} 
                  alt="Current" 
                  className="h-32 object-contain border border-[#808080]" 
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={handleStockChange}
            />
            <Label htmlFor="inStock" className="font-comic-sans">In Stock</Label>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full sketchy-button font-comic-sans"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : mode === 'create' ? 'Add Product' : 'Update Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
