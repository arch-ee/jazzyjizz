/*
  # Server-Side Orders Implementation

  1. New Tables
    - orders: Stores order information
    - order_items: Stores items within each order
  
  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
    - Ensure proper cascading deletes
*/

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  email text DEFAULT '',
  address text DEFAULT ''
);

-- Create order items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10,2) NOT NULL
);

-- Enable RLS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'orders' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'order_items' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
  DROP POLICY IF EXISTS "Anyone can read orders" ON orders;
  DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
  DROP POLICY IF EXISTS "Anyone can delete orders" ON orders;
  DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
  DROP POLICY IF EXISTS "Anyone can read order items" ON order_items;
  DROP POLICY IF EXISTS "Anyone can update order items" ON order_items;
  DROP POLICY IF EXISTS "Anyone can delete order items" ON order_items;
END $$;

-- Create new policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete orders"
  ON orders FOR DELETE TO public
  USING (true);

-- Create new policies for order items
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can update order items"
  ON order_items FOR UPDATE TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete order items"
  ON order_items FOR DELETE TO public
  USING (true);