# BullVision Architecture Document

## 1. Overall Architecture

BullVision follows a modern, decoupled client-server (SPA + REST API) pattern. The application is logically divided into three primary tiers:

1. **Presentation Tier (Frontend):** A React-based Single Page Application providing a highly interactive, responsive user interface.
2. **Application Tier (Backend):** A Node.js/Express RESTful API handling business logic, data validation, and third-party orchestration.
3. **Data Tier (Storage & Integrations):** 
   - **Database:** Supabase (PostgreSQL) storing Users, Portfolios, and Static Events.
   - **External APIs:** Angel One and Yahoo Finance providing dynamic stock quotes and historical market data.

## 2. Frontend Layer

- **Framework:** React 19 bootstrapped with Vite.
- **Routing:** React Router v7 implements dynamic parameter matching (e.g., `/analysis/:symbol`) and protected route wrapping.
- **State Management:** Localized component state combined with a global React Context (`AuthContext`) to manage user sessions.
- **Styling:** Tailwind CSS (v4) with centralized design tokens defined in `src/styles/`.
- **API Communication:** Axios with centralized interceptors for injecting JWTs and globally catching 401 Unauthorized responses.

## 3. Backend Layer

- **Framework:** Express.js 5 operating on Node.js 22+.
- **Security Middlewares:** `helmet` for HTTP headers, `cors` for cross-origin management, and `express-rate-limit` to prevent brute force attacks.
- **Validation:** Request payloads are rigorously sanitized and validated using `zod` via a centralized `validate.js` middleware.
- **Controllers & Services:** Controllers handle HTTP lifecycle (req, res), immediately delegating business rules to isolated Service modules (e.g., `authService.js`, `marketService.js`).

## 4. Authentication Flow

BullVision uses a stateless JWT authentication system.
1. **Login:** User submits credentials → validated by Zod → `authController` queries Supabase via `authService`.
2. **Verification:** bcrypt verifies the password against the stored hash.
3. **Token Generation:** A signed JWT (HS256) is issued containing the user ID, email, and role.
4. **Client Storage:** The token is stored in the browser's `localStorage` and appended as a Bearer token by Axios.
5. **Authorization:** Private endpoints use `authMiddleware.js` to verify the JWT signature. Expired or tampered tokens return `401 Unauthorized`.

## 5. API Integration Layer & Resiliency

BullVision requests heavy market data from external APIs. To prevent cascading failures, the architecture utilizes a **Fallback Pattern**:
- **Primary Provider:** `angelOneProvider.js` connects to the Angel One SmartAPI via an authenticated TOTP session.
- **Fallback Provider:** If Angel One times out or throws a 500 error, the `marketService` catches the exception and transparently calls `yahooProvider.js` to serve the data instead.
- **Token Manager:** `tokenManager.js` handles automatic refresh and caching of Angel One session keys using a `sessionPromise` pattern to prevent concurrent re-auth race conditions.

## 6. Database Layer

- Supabase is queried using the official `@supabase/supabase-js` client.
- **Row Level Security (RLS):** All data fetching uses the `SUPABASE_SERVICE_ROLE_KEY` in the backend, meaning the backend API assumes full responsibility for authorization. The API validates `req.user.id` against the database `user_id` column before permitting updates or deletes (e.g., in `portfolioController`).

## 7. Folder Responsibilities

### Frontend
- `src/features/` - Groups components by domain (e.g., auth, dashboard, portfolio) to prevent massive global component folders.
- `src/components/ui/` - Dumb, reusable building blocks (Cards, Buttons, Containers).
- `src/pages/` - Top-level route components that orchestrate features.
- `src/services/` - Direct HTTP mappings to the backend APIs.

### Backend
- `src/controllers/` - HTTP request extraction and response formatting.
- `src/services/` - Core business logic and database queries.
- `src/market/` - Encapsulated domain logic exclusively for external stock market data.
- `src/analytics/` - Pure mathematical functions for calculating Drawdowns, CAGR, and Risk Scores.
- `src/middlewares/` - Reusable route-level guards (Auth, Validation, Error Handling).

## 8. Request Lifecycle

Example: `POST /portfolio`
1. Request hits `/portfolio` route.
2. `authMiddleware` verifies JWT. If fail → 401.
3. `validate` middleware checks payload against Zod schema. If fail → 400.
4. `portfolioController.addHolding` extracts data and user ID.
5. `portfolioService.addHolding` executes the Supabase DB insertion.
6. Controller returns 201 Created with JSON response.
7. If an exception occurs, it is caught by `next(error)` and processed by `errorHandler.js` (stripping DB secrets before sending 500).

## 9. Error Handling Strategy

- **Backend:** A centralized `errorHandler.js` catches all exceptions. It maps specific known errors (like `SupabaseError` or `AxiosError`) to generic messages to prevent leaking stack traces or database schema information to the client.
- **Frontend:** API errors are normalized into an `ApiError` class. Unhandled render exceptions are caught by a global `<ErrorBoundary>` component that replaces the broken component tree with a graceful fallback UI.

## 10. Future Scalability

- **Caching:** A Redis layer could be placed in front of `marketService.js` to cache aggressive quote polling.
- **Microservices:** The `market/` directory is highly decoupled and can be easily extracted into a standalone Python or Go microservice for heavier ML workloads in V2.
- **Event Streaming:** WebSocket integration can be layered over the existing REST routes to push real-time ticks to the frontend.
