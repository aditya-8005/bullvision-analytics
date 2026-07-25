## Market API

### Search instruments

`GET /market/search?q=RELIANCE`

Search is case-insensitive and matches an NSE equity's name or symbol. Partial
queries are supported, for example `?q=REL`.

### Historical prices

`GET /market/price?symbol=RELIANCE&date=2020-03-20`

Symbols are normalized to the NSE cash-equity form. Cached data is read from
Supabase; a cache miss is fetched from Yahoo Finance and persisted before it is
returned.

## Historical events

`GET /events` lists the supported event records. Use the returned `id` exactly
when retrieving an event or event analysis. Event identifiers are stable codes,
not UUIDs or URL slugs. For example:

```http
GET /events/COVID_2020
GET /api/event-analysis/RELIANCE/COVID_2020
```

`/event-analysis/...` is not a registered route; event analysis is mounted at
`/api/event-analysis/...`.
