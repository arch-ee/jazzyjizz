
export type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};

export type Currency = {
  type: string;
  amount: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  inStock: boolean;
  createdAt: Date;
  currencies?: Currency[];
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
};
