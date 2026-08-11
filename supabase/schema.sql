-- Profile table: holds exactly one row (her name + passcode)
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  passcode text not null,
  created_at timestamptz not null default now()
);

-- Stories table: every pasted story lives here
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source text not null default 'other',
  category text not null default 'uncategorized',
  quality text not null default 'unrated',
  quality_notes text,
  is_duplicate boolean not null default false,
  duplicate_of uuid references stories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bulletins table: one row per day's bulletin
create table if not exists bulletins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  bulletin_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Join table: which stories are in which bulletin, and in what order
create table if not exists bulletin_stories (
  bulletin_id uuid not null references bulletins(id) on delete cascade,
  story_id uuid not null references stories(id) on delete cascade,
  order_index integer not null,
  primary key (bulletin_id, story_id)
);

-- Keep updated_at fresh automatically on stories
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger stories_updated_at
before update on stories
for each row execute function set_updated_at();

create trigger bulletins_updated_at
before update on bulletins
for each row execute function set_updated_at();