
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'rank',
  server text NOT NULL DEFAULT 'gem',
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  original_price numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT TO public
  USING (is_active = true);

-- Seed Gem SMP ranks
INSERT INTO public.products (product_key, category, server, name, description, price, original_price, sort_order) VALUES
('pro', 'rank', 'gem', 'PRO RANK', 'Start your journey with the PRO status. Includes essential commands and exclusive gear.', 40, 50, 1),
('elite', 'rank', 'gem', 'ELITE RANK', 'Step up your game with backpack access, more homes, and premium perks.', 60, 70, 2),
('legend', 'rank', 'gem', 'LEGEND RANK', 'Become a legend on the server with exclusive kit and priority access.', 90, 110, 3),
('immortal', 'rank', 'gem', 'IMMORTAL RANK', 'Unlock the power of eternity with flight and legendary abilities.', 120, 150, 4),
('deadliest', 'rank', 'gem', 'DEADLIEST RANK', 'Unleash your true combat potential with Bolt Armor Trim and Redstone upgrades.', 170, 200, 5),
('supreme', 'rank', 'gem', 'SUPREME RANK', 'The ultimate status. Dominate with maximum slots and Silence Armor Trim.', 220, 250, 6),
('spicy', 'rank', 'gem', 'SPICY RANK', 'The ultimate signature rank! Silence Armor Trim with Emerald Material and max enchants.', 280, 320, 7),
('custom', 'rank', 'gem', 'CUSTOM RANK', 'Create your own identity! Choose your own rank name with SPICY Kit perks + 2000 Claim Blocks.', 340, 400, 8);

-- Seed Lifesteal ranks (same ranks, same prices)
INSERT INTO public.products (product_key, category, server, name, description, price, original_price, sort_order) VALUES
('ls-pro', 'rank', 'lifesteal', 'PRO RANK', 'Start your Lifesteal journey with PRO status.', 40, 50, 1),
('ls-elite', 'rank', 'lifesteal', 'ELITE RANK', 'Step up in Lifesteal with premium perks.', 60, 70, 2),
('ls-legend', 'rank', 'lifesteal', 'LEGEND RANK', 'Become a Lifesteal legend.', 90, 110, 3),
('ls-immortal', 'rank', 'lifesteal', 'IMMORTAL RANK', 'Unlock eternity in Lifesteal.', 120, 150, 4),
('ls-deadliest', 'rank', 'lifesteal', 'DEADLIEST RANK', 'Unleash combat potential in Lifesteal.', 170, 200, 5),
('ls-supreme', 'rank', 'lifesteal', 'SUPREME RANK', 'Supreme domination in Lifesteal.', 220, 250, 6),
('ls-spicy', 'rank', 'lifesteal', 'SPICY RANK', 'The ultimate Lifesteal signature rank!', 280, 320, 7),
('ls-custom', 'rank', 'lifesteal', 'CUSTOM RANK', 'Create your own Lifesteal identity!', 340, 400, 8);

-- Seed Gem SMP keys
INSERT INTO public.products (product_key, category, server, name, description, price, original_price, sort_order) VALUES
('vote-key', 'key', 'gem', 'Vote Key', 'Get this key for FREE by voting!', 0, 0, 1),
('party-key', 'key', 'gem', 'Party Key', 'Colorful candles and party decorations!', 5, 5, 2),
('apple-key', 'key', 'gem', 'Apple Key', 'Netherite gear with high enchantments.', 10, 10, 3),
('banana-key', 'key', 'gem', 'Banana Key', 'Full Netherite kit with high-level enchantments.', 15, 15, 4),
('blood-key', 'key', 'gem', 'Blood Key', 'Powerful Netherite kit with Notch Apples.', 20, 20, 5),
('blue-key', 'key', 'gem', 'Blue Key', 'High-value Netherite kit with extreme enchantments.', 25, 25, 6),
('purple-key', 'key', 'gem', 'Purple Key', 'The ultimate key with Mace weapon and max enchants.', 30, 30, 7);

-- Seed Lifesteal keys
INSERT INTO public.products (product_key, category, server, name, description, price, original_price, sort_order) VALUES
('core-key', 'key', 'lifesteal', 'Core Key', 'Essential Lifesteal gear with balanced enchantments.', 10, 10, 1),
('flux-key', 'key', 'lifesteal', 'Flux Key', 'Advanced Lifesteal kit with powerful enchantments.', 20, 20, 2),
('aura-key', 'key', 'lifesteal', 'Aura Key', 'Ultimate Lifesteal crate with max enchantments.', 30, 30, 3);
