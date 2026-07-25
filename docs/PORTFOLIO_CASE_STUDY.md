# BullVision V1: Engineering Case Study

## The Problem
Retail investors have access to an overwhelming amount of raw financial data, but lack the tools to contextualize it historically. While modern brokers provide current prices, understanding how a specific asset reacts to macroeconomic shocks (e.g., global pandemics, housing crashes) typically requires expensive institutional software or tedious manual spreadsheet calculations. 

## The Motivation
BullVision was conceived to democratize historical risk analysis. The goal was to build a platform that doesn't just show a stock going up or down, but automatically correlates that movement against historical crises to calculate Resilience and Recovery metrics. 

## Research & Requirements
To build this, the platform required:
1. **High-quality Historical Data:** Daily candle data going back at least 10–15 years.
2. **Reliable Live Quotes:** To compare current valuations against historical baselines.
3. **Performance:** The frontend needed to render massive datasets (thousands of daily candles) without locking up the browser thread.
4. **Security:** User portfolios required strict authorization boundaries to prevent data leakage.

## Architecture Decisions

### 1. The Fallback Provider Pattern (Backend)
Relying on a single free or retail-tier API for financial data is a single point of failure. Market APIs are prone to rate limits, timeouts, and unannounced schema changes. 

**Decision:** We implemented the `marketService` using an Interface/Adapter pattern. 
- The primary data source is the **Angel One SmartAPI**.
- If a request times out or returns a 5xx error, the backend catches the exception and transparently routes the request to a fallback provider (**Yahoo Finance**).
- **Result:** Near 100% uptime for market data endpoints, entirely opaque to the frontend client.

### 2. Native SVG Charting (Frontend)
Most financial applications rely on heavy charting libraries (like Chart.js or Recharts). While feature-rich, these libraries add hundreds of kilobytes to the JavaScript bundle and can cause significant render lag when plotting 3,000+ data points.

**Decision:** We built a custom SVG path generator (`buildChartPath` in `AnalysisPage.tsx`). 
- The function takes an array of closing prices, normalizes the X/Y coordinates mathematically, and generates a single SVG `<path>` string.
- **Result:** The chart renders in under 5 milliseconds. The JS bundle size remained incredibly lean, resulting in a significantly faster Time to Interactive (TTI).

### 3. Stateless JWT Authentication
To ensure the backend could scale horizontally without sticky sessions, we chose a stateless JWT architecture. 

**Decision:** 
- JWTs are generated via `jsonwebtoken` using the HS256 algorithm and a strong secret.
- The `authMiddleware.js` verifies the token signature on every protected route.
- Crucially, the backend does *not* trust client-provided IDs for mutating data. When a user deletes a portfolio item, the SQL query explicitly filters by the `user_id` extracted from the verified JWT payload, eliminating Insecure Direct Object Reference (IDOR) vulnerabilities.

## Challenges & Solutions

**Challenge: White Screen of Death on API Failures**
Early in development, if the backend returned an unexpected data shape (e.g., a missing profile object), the React components would throw a TypeError during render, crashing the entire application to a blank white screen.

**Solution:** 
We implemented a global React `<ErrorBoundary>`. If any component throws a runtime exception, the Error Boundary catches it and mounts a graceful fallback UI, allowing the user to reload the page or navigate away without losing the core application shell.

**Challenge: Auth Token Expiry Confusion**
When the 15-minute JWT expired, subsequent API calls returned `401 Unauthorized`. However, the frontend remained on the Dashboard but displayed broken, empty UI components.

**Solution:** 
We built a global Axios response interceptor in `api.ts`. If any API call returns a 401, the interceptor fires a callback that clears the token from `localStorage` and forces a React Router redirect back to `/login`.

## Tech Stack
- **React 19 & Vite:** For blazing fast HMR and optimized static builds.
- **TailwindCSS 4:** For the premium, glassmorphic UI system without writing custom CSS.
- **Node.js & Express 5:** For the high-throughput REST API.
- **Supabase (PostgreSQL):** For relational storage and Row Level Security.
- **Zod:** For end-to-end type safety and payload sanitization.

## Lessons Learned
1. **Never trust external APIs:** Always wrap third-party network calls in try/catch blocks with aggressive timeouts and fallback mechanisms.
2. **Vanilla React is fast enough:** Before reaching for a heavy dependency, evaluate if native browser APIs (like SVG paths) can solve the problem more efficiently.
3. **Fail securely:** Always catch backend database errors and map them to generic HTTP responses to prevent leaking internal infrastructure details.

## Future Improvements
As we move into V2, the architecture is primed for the introduction of Python-based microservices. The decoupled `market` directory can easily stream data to a secondary ML service to generate real-time predictive analytics based on the historical event baselines we've established.
