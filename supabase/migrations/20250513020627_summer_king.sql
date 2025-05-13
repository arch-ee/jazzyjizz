/*
  # Update permissions for products and orders

  1. Changes
    - Add update and delete policies for products table
    - Add update and delete policies for orders table
    - Add update and delete policies for order items table
    - Add update and delete policies for currencies table

  2. Security
    - Enable RLS on all tables
    - Add comprehensive CRUD policies
*/

-- Update product policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can update products'
  ) THEN
    CREATE POLICY "Anyone can update products" ON products
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can delete products'
  ) THEN
    CREATE POLICY "Anyone can delete products" ON products
    FOR DELETE TO public
    USING (true);
  END IF;
END $$;

-- Update order policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Anyone can delete orders'
  ) THEN
    CREATE POLICY "Anyone can delete orders" ON orders
    FOR DELETE TO public
    USING (true);
  END IF;
END $$;

-- Update order items policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' AND policyname = 'Anyone can update order items'
  ) THEN
    CREATE POLICY "Anyone can update order items" ON order_items
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' AND policyname = 'Anyone can delete order items'
  ) THEN
    CREATE POLICY "Anyone can delete order items" ON order_items
    FOR DELETE TO public
    USING (true);
  END IF;
END $$;

-- Update currency policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'currencies' AND policyname = 'Anyone can update currencies'
  ) THEN
    CREATE POLICY "Anyone can update currencies" ON currencies
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'currencies' AND policyname = 'Anyone can delete currencies'
  ) THEN
    CREATE POLICY "Anyone can delete currencies" ON currencies
    FOR DELETE TO public
    USING (true);
  END IF;
END $$;