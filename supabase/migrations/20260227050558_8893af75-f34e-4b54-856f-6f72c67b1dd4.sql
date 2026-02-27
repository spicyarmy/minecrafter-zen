
-- Store settings table for admin controls
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for server visibility checks)
CREATE POLICY "Anyone can read settings" ON public.store_settings FOR SELECT USING (true);

-- Insert default settings
INSERT INTO public.store_settings (key, value) VALUES
  ('server_spicy_enabled', 'true'),
  ('server_token_enabled', 'false'),
  ('server_oneblock_enabled', 'false'),
  ('site_discount_percent', '20'),
  ('payment_qr_url', '"default"');
