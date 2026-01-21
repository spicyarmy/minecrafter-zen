-- Create enum for coupon status
CREATE TYPE public.coupon_status AS ENUM ('active', 'inactive', 'expired');

-- Create coupons table
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can check if coupon is valid)
CREATE POLICY "Anyone can read active coupons"
ON public.coupons
FOR SELECT
USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_coupons_updated_at();

-- Insert some sample coupons for testing
INSERT INTO public.coupons (code, discount_percent, expires_at, is_active, usage_limit) VALUES
('WELCOME10', 10, '2026-12-31 23:59:59+00', true, 100),
('SPICY20', 20, '2026-06-30 23:59:59+00', true, 50),
('VIP50', 50, '2026-03-31 23:59:59+00', true, 10);