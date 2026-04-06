ALTER TABLE public.lots
  ADD COLUMN IF NOT EXISTS reglement_url text;
