-- Add new fields to lots
ALTER TABLE lots
  ADD COLUMN IF NOT EXISTS categorie TEXT DEFAULT 'autre' CHECK (categorie IN ('tech','mode','gaming','maison','luxe','autre')),
  ADD COLUMN IF NOT EXISTS valeur_estimee NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS winner_participation_id UUID,
  ADD COLUMN IF NOT EXISTS drawn_at TIMESTAMPTZ;

-- Add game reference to participations
ALTER TABLE participations
  ADD COLUMN IF NOT EXISTS reference_jeu TEXT;

-- Generate reference_jeu for existing participations
UPDATE participations
SET reference_jeu = '#JEU-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0')
WHERE reference_jeu IS NULL;

-- Create draws table
CREATE TABLE IF NOT EXISTS draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lot_id UUID REFERENCES lots(id) NOT NULL,
  winning_ticket INTEGER NOT NULL,
  winner_id UUID NOT NULL,
  total_tickets INTEGER NOT NULL,
  total_players INTEGER NOT NULL,
  drawn_at TIMESTAMPTZ DEFAULT NOW(),
  draw_method TEXT DEFAULT 'crypto-rng'
);

ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view draws" ON draws FOR SELECT USING (true);
