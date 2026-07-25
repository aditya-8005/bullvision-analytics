# Changelog

All notable changes to the BullVision project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] - 2026-07-25

### 🚀 Major Features
- **Initial Public Release of BullVision Analytics.**
- **Secure Authentication:** Complete JWT-based authentication flow with encrypted passwords (bcrypt) and Supabase storage.
- **Portfolio Management:** Dashboard to add, edit, track, and remove user stock holdings.
- **Live Stock Search:** High-performance, debounced NSE stock search functionality with recent history.
- **Market Data Integration:** Integrated Angel One SmartAPI for real-time quotes, backed by a graceful failure cache falling back to Yahoo Finance.
- **Historical Analysis Workspace:** Interactive 10-year stock price history charts utilizing highly optimized SVG path rendering.
- **Event Correlation Engine:** Automated engine that cross-references user portfolios against historical market shocks (e.g., COVID-19, 2008 Crash) to compute Drawdown, Recovery Time, and Resilience Scores.

### 🛡 Security
- Complete implementation of Express Rate Limiting on authentication endpoints.
- Global Error Boundaries implemented on the React frontend to prevent White Screens of Death.
- Opaque backend error handling ensuring zero database schema or API credential leakage to clients.
- Strong Zod validation schemas applied to all incoming REST payloads.

### 🐛 Bug Fixes (During Beta)
- Fixed an IDOR vulnerability where portfolio endpoints ignored the authenticated user token.
- Fixed a silent failure on 401 Unauthorized API responses by implementing a global Axios interceptor.
- Replaced disruptive native browser `alert()` popups with a modern, glassmorphic toast notification system (Sonner).
- Fixed Docker Compose network configuration replacing `localhost` with correct container networking URLs.
- Resolved race conditions (stale closures) during rapid switching of stock tickers in the Analysis Workspace.

### ⚠️ Known Limitations
- The initial bundle size of the frontend is slightly large due to missing route-level lazy loading. This will be addressed in v1.1.0.
- Live ticks (WebSocket) are not yet supported; price data requires a page refresh.
