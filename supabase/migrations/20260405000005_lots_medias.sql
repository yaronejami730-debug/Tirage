ALTER TABLE public.lots
  ADD COLUMN IF NOT EXISTS date_ouverture timestamptz,
  ADD COLUMN IF NOT EXISTS medias text[] DEFAULT '{}';
