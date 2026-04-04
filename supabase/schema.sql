-- Lots table
create table lots (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  description text,
  image_url text,
  prix_ticket numeric(10,2) not null,
  total_tickets integer not null,
  tickets_vendus integer default 0,
  reference_lot text unique not null,
  date_fin timestamptz,
  statut text default 'actif' check (statut in ('actif', 'termine', 'archive')),
  created_at timestamptz default now()
);

-- Participations table
create table participations (
  id uuid default gen_random_uuid() primary key,
  lot_id uuid references lots(id) not null,
  nom text not null,
  prenom text not null,
  email text not null,
  telephone text,
  quantite integer not null,
  ticket_numbers integer[] not null default '{}',
  stripe_payment_id text unique,
  stripe_session_id text unique,
  statut text default 'en_attente' check (statut in ('en_attente', 'confirme', 'annule')),
  created_at timestamptz default now()
);

-- Index for performance
create index on participations(lot_id);
create index on participations(email);
create index on participations(stripe_session_id);

-- Row Level Security
alter table lots enable row level security;
alter table participations enable row level security;

-- Allow public read access to active lots
create policy "Public can view active lots"
  on lots for select
  using (statut = 'actif');

-- Allow public to insert participations (pending)
create policy "Public can insert participations"
  on participations for insert
  with check (true);

-- Allow public to read their own participations by session_id
create policy "Public can view participation by session"
  on participations for select
  using (true);
