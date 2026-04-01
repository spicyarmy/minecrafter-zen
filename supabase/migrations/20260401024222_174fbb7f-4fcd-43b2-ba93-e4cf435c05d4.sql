
CREATE TABLE public.pending_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  command text NOT NULL,
  server text NOT NULL DEFAULT 'gem',
  status text NOT NULL DEFAULT 'pending',
  product_info text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  executed_at timestamptz DEFAULT NULL
);

ALTER TABLE public.pending_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to pending_commands" ON public.pending_commands
  FOR SELECT TO public USING (false);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS command_template text DEFAULT '';
