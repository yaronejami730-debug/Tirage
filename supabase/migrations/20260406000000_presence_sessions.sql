-- Table pour le tracking de présence en mode HTTP (de secours)
CREATE TABLE IF NOT EXISTS public.presence_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    channel TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, channel)
);

-- Index pour performance (nettoyage et comptage)
CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON public.presence_sessions(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_presence_channel ON public.presence_sessions(channel);

-- RLS (Row Level Security)
ALTER TABLE public.presence_sessions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde d'enregistrer sa présence (UPSERT)
-- Note: Le service role côté serveur contourne cela, mais c'est une bonne pratique.
CREATE POLICY "Enable insert/update for all (anonyme)" ON public.presence_sessions
FOR ALL USING (true) WITH CHECK (true);
