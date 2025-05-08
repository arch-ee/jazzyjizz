
import { useState } from 'react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface ProductFormProps {
  product?: Product;
  onSubmit?: () => void;
  mode: 'create' | 'edit';
}

const ProductForm = ({ product, onSubmit, mode }: ProductFormProps) => {
  const { addProduct, updateProduct } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    image: product?.image || '/placeholder.svg',
    category: product?.category || '',
    inStock: product?.inStock !== undefined ? product.inStock : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleStockChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, inStock: checked }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, price: isNaN(value) ? 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'create') {
        addProduct(formData);
      } else if (mode === 'edit' && product) {
        updateProduct(product.id, formData);
      }
      
      if (onSubmit) onSubmit();

      if (mode === 'create') {
        // Reset form if creating
        setFormData({
          name: '',
          description: '',
          price: 0,
          image: '/placeholder.svg',
          category: '',
          inStock: true,
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ["Sweets", "Chocolate", "Gummy", "Chewy", "Hard Candy", "Lollipop", "Sour", "Sugar-Free"];

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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/placeholder.svg"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={handleStockChange}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-candy-purple to-candy-pink hover:from-candy-pink hover:to-candy-purple"
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
