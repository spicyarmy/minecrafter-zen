
-- Satisfy linter: no public access to wheel_codes, only service role via edge function
CREATE POLICY "No public access to wheel codes"
  ON public.wheel_codes FOR SELECT TO public
  USING (false);
