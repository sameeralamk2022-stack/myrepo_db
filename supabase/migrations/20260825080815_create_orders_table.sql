/*
# Create orders table for CAPTAIN-D delivery app

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `order_id` (text, unique) - the human-readable order ID like CAPTAIN-D-20260825-1234
  - `customer_name` (text, not null)
  - `phone` (text, not null)
  - `items` (jsonb, not null) - array of cart items
  - `pickup_address` (text, not null)
  - `delivery_address` (text, not null)
  - `location` (text) - optional maps link
  - `status` (text, not null, default 'Requested')
  - `rating` (integer) - optional 1-5 rating
  - `feedback` (text) - optional feedback text
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- Allow anon + authenticated CRUD because this is a no-auth app (no sign-in screen).
- All policies use `USING (true)` / `WITH CHECK (true)` since data is intentionally shared/public.

3. Notes
- The app stores orders in localStorage currently; this table provides server-side persistence.
- The edge function `google-sheets-redirect` can POST order data here or to Google Sheets.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  pickup_address text NOT NULL,
  delivery_address text NOT NULL,
  location text,
  status text NOT NULL DEFAULT 'Requested',
  rating integer,
  feedback text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
