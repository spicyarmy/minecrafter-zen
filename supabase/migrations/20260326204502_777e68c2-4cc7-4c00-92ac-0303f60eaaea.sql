
-- Wheel items table
CREATE TABLE public.wheel_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  value_label text DEFAULT '',
  weight integer NOT NULL DEFAULT 10,
  color text DEFAULT '#ff00aa',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.wheel_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active wheel items"
  ON public.wheel_items FOR SELECT TO public
  USING (is_active = true);

-- Wheel spin codes table
CREATE TABLE public.wheel_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  is_used boolean DEFAULT false,
  used_by text,
  won_item text,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

ALTER TABLE public.wheel_codes ENABLE ROW LEVEL SECURITY;

-- No public read policy - codes managed via admin edge function only
