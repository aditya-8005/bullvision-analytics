# Release Notes: BullVision v1.0.0

**Release Date:** 2026-07-25
**Status:** Feature Freeze / Production Ready

We are thrilled to announce the official v1.0.0 release of BullVision, the premium stock market analytics platform designed to correlate live portfolios against historical market shocks.

---

## 🌟 Highlights

- **Dynamic Event Correlation:** For the first time, users can instantly see how their specific stock holdings reacted to major historical events (e.g., COVID-19, 2008 Financial Crisis).
- **Ultra-Fast UI:** The frontend has been optimized using native SVG rendering and debounced API calls, delivering a sub-second analytical workspace.
- **Resilient Infrastructure:** The backend employs a seamless fallback architecture, ensuring market data remains available even if the primary broker API experiences downtime.

---

## 🚀 Major Features

1. **Authentication & Authorization**
   - Secure, stateless JWT implementation.
   - Global Axios interceptors that smoothly handle token expiry by redirecting users to the login screen without breaking the UI.

2. **Portfolio Management**
   - Full CRUD capabilities for tracking stock holdings.
   - Robust backend protection against IDOR (Insecure Direct Object Reference) vulnerabilities.

3. **Analytics Workspace**
   - 10-year interactive price charts.
   - Automated calculation of Maximum Drawdown, Recovery Time (in days), and Risk Resilience Scores.

4. **Premium UX**
   - Tailwind-powered glassmorphic design system.
   - Native browser `alert()` popups have been entirely replaced with elegant, non-blocking toast notifications (Sonner).
   - Global Error Boundaries prevent "White Screens of Death" upon unexpected render errors.

---

## ⚠️ Breaking Changes (From Beta)

- **Portfolio Route Security:** The `GET /portfolio/:id` endpoint no longer accepts arbitrary IDs. It now strictly enforces the `user_id` encoded within the JWT. Any scripts relying on passing a raw user ID in the URL will need to be updated.
- **API URL Configuration:** The frontend now explicitly requires the `VITE_API_BASE_URL` environment variable for production builds.

---

## 🐛 Known Issues

- **Bundle Size Warning:** Vite currently warns that the main JavaScript chunk exceeds 500kb. This does not significantly impact modern connections, but route-level code splitting (`React.lazy`) is scheduled for v1.1.0 to optimize initial load times.
- **API Rate Limits:** Free-tier usage of the Yahoo Finance fallback provider may trigger HTTP 429 (Too Many Requests) if searching hundreds of symbols concurrently. 

---

## 🔄 Upgrade Notes

If upgrading from an earlier beta clone:
1. Ensure you run `npm install` in both the `FRONTEND` and `BACKEND` directories to pull down the newly added `sonner` toast library.
2. Review the updated `BACKEND/.env.example` file. Duplicate variables have been removed.

---

## 🙏 Acknowledgements

A huge thank you to the open-source communities behind **React**, **Express**, **TailwindCSS**, and **Vite**. Their incredible tooling made building BullVision's performant architecture possible. 
