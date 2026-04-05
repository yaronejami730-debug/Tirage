import { createClient } from "@supabase/supabase-js";

export type Lot = {
  id: string;
  nom: string;
  description: string | null;
  image_url: string | null;
  prix_ticket: number;
  total_tickets: number;
  tickets_vendus: number;
  reference_lot: string;
  date_fin: string | null;
  statut: "actif" | "termine" | "archive" | "programme";
  categorie: "smartphone" | "tech" | "gaming" | "audio" | "photo" | "tv" | "maison" | "electromenager" | "mode" | "bijoux" | "montres" | "sacs" | "chaussures" | "parfum" | "sport" | "voiture" | "moto" | "voyage" | "gastronomie" | "art" | "luxe" | "enfants" | "culture" | "crypto" | "autre";
  valeur_estimee: number | null;
  winner_participation_id: string | null;
  drawn_at: string | null;
  date_ouverture: string | null;
  medias: string[] | null;
  created_at: string;
};

export type Participation = {
  id: string;
  lot_id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  quantite: number;
  ticket_numbers: number[];
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  reference_jeu: string | null;
  statut: "en_attente" | "confirme" | "annule";
  created_at: string;
  lots?: Lot;
};

export type Annonce = {
  id: string;
  texte: string;
  couleur: string;
  emoji: string | null;
  actif: boolean;
  created_at: string;
};

export const supabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
