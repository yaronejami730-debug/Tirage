create table public.annonces (
  id uuid primary key default gen_random_uuid(),
  texte text not null,
  couleur text not null default '#6C5CE7',
  emoji text,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);
