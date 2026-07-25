-- RLS policy model
--
-- The Express backend uses the server-only Supabase service-role/secret key,
-- which bypasses RLS. These policies protect the tables if they are ever
-- accessed through the Supabase Data API with an anon or authenticated key.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY to a client.

-- `public.users` includes password_hash and is therefore backend-only. No
-- client policy is deliberately created for this table. User credentials
-- must never be readable through the Data API.
revoke all on public.users from anon, authenticated;

-- Reference market data is safe to read publicly, but writes remain limited
-- to the backend service role because no insert/update/delete policies exist.
revoke all on public.companies from anon, authenticated;
revoke all on public.historical_events from anon, authenticated;
revoke all on public.historical_prices from anon, authenticated;
grant select on public.companies, public.historical_events, public.historical_prices to anon, authenticated;

create policy "Public can read companies"
on public.companies
for select
to anon, authenticated
using (true);

create policy "Public can read historical events"
on public.historical_events
for select
to anon, authenticated
using (true);

create policy "Public can read historical prices"
on public.historical_prices
for select
to anon, authenticated
using (true);

-- Private data is restricted to the authenticated Supabase user whose UUID
-- matches the application user_id. The Express API separately applies the
-- same ownership filter with its existing JWT middleware.
revoke all on public.watchlists, public.watchlist_items, public.portfolios, public.portfolio_transactions from anon, authenticated;
grant select, insert, update, delete on public.watchlists, public.watchlist_items, public.portfolios, public.portfolio_transactions to authenticated;

create policy "Users manage their own watchlists"
on public.watchlists
for all
to authenticated
using ((select auth.uid()) is not null and user_id = (select auth.uid()))
with check ((select auth.uid()) is not null and user_id = (select auth.uid()));

create policy "Users manage items in their own watchlists"
on public.watchlist_items
for all
to authenticated
using (
    exists (
        select 1
        from public.watchlists
        where watchlists.id = watchlist_items.watchlist_id
          and watchlists.user_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.watchlists
        where watchlists.id = watchlist_items.watchlist_id
          and watchlists.user_id = (select auth.uid())
    )
);

create policy "Users manage their own portfolio holdings"
on public.portfolios
for all
to authenticated
using ((select auth.uid()) is not null and user_id = (select auth.uid()))
with check ((select auth.uid()) is not null and user_id = (select auth.uid()));

create policy "Users manage transactions for their own holdings"
on public.portfolio_transactions
for all
to authenticated
using (
    exists (
        select 1
        from public.portfolios
        where portfolios.id = portfolio_transactions.portfolio_id
          and portfolios.user_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.portfolios
        where portfolios.id = portfolio_transactions.portfolio_id
          and portfolios.user_id = (select auth.uid())
    )
);

-- The backend service role needs explicit table privileges in addition to its
-- RLS bypass. It is server-only and must never be used in browser code.
grant all privileges on public.users,
    public.companies,
    public.historical_events,
    public.historical_prices,
    public.watchlists,
    public.watchlist_items,
    public.portfolios,
    public.portfolio_transactions
to service_role;
