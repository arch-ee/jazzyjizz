/*
  # Simplify Orders Table

  1. Changes
    - Remove email and address fields from orders table
    - Set default values to empty string for backward compatibility
  
  2. Notes
    - Existing orders will keep their data
    - New orders will not require these fields
*/

ALTER TABLE orders 
ALTER COLUMN email SET DEFAULT '',
ALTER COLUMN address SET DEFAULT '';