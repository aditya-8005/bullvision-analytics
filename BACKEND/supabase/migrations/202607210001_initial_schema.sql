create extension if not exists pgcrypto;

create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) > 0),
    email text not null unique check (email = lower(email)),
    password_hash text not null,
    role text not null default 'user' check (role in ('user', 'admin')),
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.companies (
    id text primary key,
    name text not null,
    listings jsonb not null default '[]'::jsonb,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.historical_events (
    id text primary key,
    name text not null,
    category text not null,
    country text not null,
    start_date date not null,
    end_date date not null,
    description text,
    details jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    check (end_date >= start_date)
);

create table if not exists public.historical_prices (
    id bigint generated always as identity primary key,
    company_id text references public.companies(id) on delete set null,
    symbol text not null,
    exchange text not null default 'UNKNOWN',
    price_date date not null,
    open numeric(20,6),
    high numeric(20,6),
    low numeric(20,6),
    close numeric(20,6) not null,
    adjusted_close numeric(20,6),
    volume bigint,
    source text,
    created_at timestamptz not null default timezone('utc', now()),
    unique (symbol, exchange, price_date)
);

create table if not exists public.watchlists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    name text not null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    unique (user_id, name)
);

create table if not exists public.watchlist_items (
    id uuid primary key default gen_random_uuid(),
    watchlist_id uuid not null references public.watchlists(id) on delete cascade,
    company_id text references public.companies(id) on delete set null,
    symbol text not null,
    exchange text,
    created_at timestamptz not null default timezone('utc', now()),
    unique (watchlist_id, symbol, exchange)
);

-- A portfolio row is a current holding, preserving the existing /portfolio API contract.
create table if not exists public.portfolios (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    company_id text references public.companies(id) on delete set null,
    symbol text not null,
    exchange text not null check (exchange in ('NSE', 'BSE')),
    quantity numeric(20,6) not null check (quantity >= 1),
    average_buy_price numeric(20,6) not null check (average_buy_price >= 0),
    purchase_date date not null,
    notes text not null default '' check (char_length(notes) <= 300),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.portfolio_transactions (
    id uuid primary key default gen_random_uuid(),
    portfolio_id uuid not null references public.portfolios(id) on delete cascade,
    transaction_type text not null check (transaction_type in ('BUY', 'SELL', 'ADJUSTMENT')),
    quantity numeric(20,6) not null check (quantity > 0),
    price numeric(20,6) not null check (price >= 0),
    transaction_date date not null,
    notes text not null default '',
    created_at timestamptz not null default timezone('utc', now())
);

create index if not exists historical_events_category_idx on public.historical_events(category);
create index if not exists historical_prices_symbol_date_idx on public.historical_prices(symbol, price_date);
create index if not exists portfolios_user_id_idx on public.portfolios(user_id);
create index if not exists watchlists_user_id_idx on public.watchlists(user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();
drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at before update on public.companies for each row execute function public.set_updated_at();
drop trigger if exists historical_events_set_updated_at on public.historical_events;
create trigger historical_events_set_updated_at before update on public.historical_events for each row execute function public.set_updated_at();
drop trigger if exists watchlists_set_updated_at on public.watchlists;
create trigger watchlists_set_updated_at before update on public.watchlists for each row execute function public.set_updated_at();
drop trigger if exists portfolios_set_updated_at on public.portfolios;
create trigger portfolios_set_updated_at before update on public.portfolios for each row execute function public.set_updated_at();

-- The backend uses SUPABASE_SERVICE_ROLE_KEY. Keep direct client access denied by default.
alter table public.users enable row level security;
alter table public.companies enable row level security;
alter table public.historical_events enable row level security;
alter table public.historical_prices enable row level security;
alter table public.watchlists enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.portfolios enable row level security;
alter table public.portfolio_transactions enable row level security;
