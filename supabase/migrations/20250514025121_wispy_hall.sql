/*
  # Add review replies and admin features

  1. Changes
    - Add reply column to reviews table
    - Add admin_reply column to identify admin responses
    - Add timestamp for replies
    
  2. Notes
    - Existing reviews will keep their data
    - New reviews can have admin replies
*/

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS reply text,
ADD COLUMN IF NOT EXISTS admin_reply boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS replied_at timestamptz;