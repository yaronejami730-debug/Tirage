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
  statut: "actif" | "termine" | "archive";
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
  statut: "en_attente" | "confirme" | "annule";
  created_at: string;
  lots?: Lot;
};

// Client-side Supabase client (uses anon key)
export const supabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Server-side Supabase client (uses service role key - never expose to client)
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
