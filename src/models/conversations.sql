-- Remove any existing RLS policies that may restrict access
DROP POLICY IF EXISTS "Anyone can insert conversations" ON conversations; 

-- Allow unauthenticated users to insert conversations
CREATE POLICY "Anyone can insert conversations"
  ON conversations FOR INSERT
  WITH CHECK (true); 