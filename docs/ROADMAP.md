# BullVision Roadmap

This document outlines the strategic vision for BullVision. It tracks what we have accomplished and where we are heading in future releases.

---

## ✅ Completed (V1.0.0)

- **Core Infrastructure:** Set up Express/React monorepo architecture.
- **Authentication:** Secure JWT login, registration, and logout flows.
- **Market Data Pipeline:** Angel One SmartAPI integration with Yahoo Finance fallback.
- **Historical Analysis Engine:** Custom logic to calculate Event Drawdown, Recovery Time, and Resilience scores.
- **Portfolio Basics:** CRUD operations for user stock holdings.
- **Performant UI:** Native SVG charting and debounced stock search.
- **Production Hardening:** Rate limiting, Zod validation, global error handlers, and JWT pinning.

---

## 🚧 In Progress (V1.1.x)

- **Frontend Optimization:** Implementing Route-based Code Splitting (React.lazy) to reduce the initial bundle size.
- **Extended Test Coverage:** Increasing Jest unit test coverage for the React frontend components.
- **Social Login:** Integrating Google and GitHub OAuth providers via Supabase Auth.

---

## 🔮 Future Vision (V2.x.x)

BullVision V2 will pivot from historical analytics into real-time forecasting and advanced AI integrations.

### Machine Learning & Prediction Models
- Integration with TensorFlow.js / Python microservices to run predictive algorithms on short-term price movements.
- Automated pattern recognition (Head & Shoulders, Double Bottoms, etc.).

### AI Insights & News Sentiment
- Implement an LLM pipeline to digest daily financial news.
- Generate real-time "Sentiment Scores" for specific stocks and sectors based on global headlines.

### Live WebSockets
- Replace REST-based polling for stock quotes with WebSocket connections directly to the broker for sub-second tick data.

### Options Analysis
- Build an advanced derivatives dashboard.
- Visualize Option Chains, Implied Volatility (IV) crush scenarios, and the Greeks (Delta, Gamma, Theta, Vega).

### Portfolio Optimization
- Modern Portfolio Theory (MPT) implementation.
- Provide users with an "Efficient Frontier" graph and automated recommendations to rebalance their portfolio for optimal risk/reward ratios.
