-- Layers: PF (Kaique) and PJ (Luvisi's)
create table layers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('PF', 'PJ')),
  created_at timestamptz default now()
);

insert into layers (name, type) values ('Kaique', 'PF'), ('Luvisi''s', 'PJ');

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  layer_type text check (layer_type in ('PF', 'PJ', 'BOTH')),
  icon text,
  color text
);

insert into categories (name, layer_type, icon, color) values
  ('Alimentação', 'PF', '🍽️', '#ef4444'),
  ('Transporte', 'PF', '🚗', '#f97316'),
  ('Moradia', 'PF', '🏠', '#84cc16'),
  ('Saúde', 'PF', '💊', '#06b6d4'),
  ('Lazer', 'PF', '🎮', '#8b5cf6'),
  ('Investimentos', 'PF', '📈', '#10b981'),
  ('Fornecedores', 'PJ', '📦', '#f59e0b'),
  ('Marketing', 'PJ', '📣', '#ec4899'),
  ('Impostos', 'PJ', '📋', '#6b7280'),
  ('Salários', 'PJ', '👥', '#3b82f6'),
  ('Pro-labore', 'BOTH', '💰', '#14b8a6'),
  ('Outros', 'BOTH', '📌', '#94a3b8');

-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  layer_id uuid references layers(id),
  category_id uuid references categories(id),
  type text not null check (type in ('receita', 'despesa', 'transferencia')),
  amount numeric(12,2) not null,
  description text,
  date date not null default current_date,
  source text default 'web' check (source in ('web', 'whatsapp')),
  whatsapp_raw text,
  created_at timestamptz default now()
);

-- Pro-labore records
create table prolabore (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12,2) not null,
  month text not null,
  status text default 'pendente' check (status in ('pendente', 'pago')),
  paid_at date,
  notes text,
  created_at timestamptz default now()
);

-- RLS
alter table transactions enable row level security;
alter table prolabore enable row level security;
alter table categories enable row level security;
alter table layers enable row level security;

create policy "allow all" on transactions for all using (true);
create policy "allow all" on prolabore for all using (true);
create policy "allow all" on categories for all using (true);
create policy "allow all" on layers for all using (true);
