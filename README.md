<div align="center">
  <h1>📈 BullVision</h1>
  <p><strong>Professional Stock Market Analytics & Historical Event Correlation Platform</strong></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br/>

## 📖 Overview

BullVision is a robust, production-grade analytics platform that allows users to manage stock portfolios and dynamically correlate historical market events with asset performance. By combining real-time quote feeds with historical data and event risk modeling, BullVision helps investors visualize how global events impact specific sectors and companies.

## ✨ Features

- **Authentication:** Secure, JWT-based authentication system featuring password hashing (bcrypt), token pinning, and strict issuer/audience validation.
- **Portfolio Management:** Add, edit, delete, and view your stock holdings via a protected personalized dashboard.
- **Stock Search:** Debounced, high-performance search querying the National Stock Exchange (NSE) database.
- **Historical Analytics:** View 10-year dynamic price charts generated cleanly using native SVG paths for unparalleled frontend performance.
- **Event-based Market Analysis:** Automatically cross-reference significant historical events against a stock's timeline to generate Risk, Drawdown, and Recovery metrics.
- **Responsive UI:** A premium, glassmorphic UI built with Tailwind CSS, perfectly responsive from mobile to ultra-wide displays.
- **Error Handling:** Complete global error boundaries on the frontend, and opacity-preserving error mappers on the backend to prevent credential leakage.
- **Production-grade Architecture:** Feature-based modular structure, centralized configuration, integration cache fallbacks, and Zod input validation.

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS 4, React Router 7, Axios, Sonner (Toasts)
- **Backend:** Node.js, Express 5, JWT, bcrypt, Zod, Helmet, Express Rate Limit
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **External APIs:** Angel One SmartAPI (Primary Data), Yahoo Finance (Fallback Cache)
- **Deployment:** Ready for Docker, Vercel/Render, and PM2.

## 📂 Folder Structure

```text
D:\BV
├── BACKEND
│   ├── src
│   │   ├── analytics     # Event and risk scoring algorithms
│   │   ├── config        # Database and system configs
│   │   ├── controllers   # Request handlers
│   │   ├── errors        # Custom error classes
│   │   ├── market        # Stock fetching, caching, and mapping logic
│   │   ├── master        # Seed data and metadata scripts
│   │   ├── middlewares   # JWT and Zod validation logic
│   │   ├── routes        # API route definitions
│   │   └── services      # Core business logic
│   ├── tests             # Unit and integration tests
│   ├── index.js          # App entry point
│   ├── package.json      
│   └── .env.example
├── FRONTEND
│   ├── src
│   │   ├── components    # Shared UI components and branding
│   │   ├── contexts      # Global React Contexts (Auth)
│   │   ├── features      # Feature-based encapsulated logic (Dashboard, Portfolio)
│   │   ├── hooks         # Custom React hooks
│   │   ├── layouts       # Navigation and App wrappers
│   │   ├── pages         # Route-level components
│   │   ├── routes        # Routing configuration (AppRoutes)
│   │   ├── services      # Axios API integrators
│   │   ├── styles        # CSS Variables and Global styles
│   │   └── types         # Shared TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
└── docs                  # Documentation (Architecture, API, Deployment)
```

## 🏗 Architecture

BullVision operates on a decoupled client-server architecture:
1. **Frontend Request:** The React SPA calls the Express API via Axios interceptors carrying a JWT.
2. **Backend Validation:** The request passes through `helmet` headers, rate limiters, JWT validation, and `zod` payload schema checks.
3. **Business Logic:** Controllers route requests to specific Services (e.g., `marketService`).
4. **Data Acquisition:** 
   - Internal state (users, portfolios, events) is fetched from **Supabase**.
   - External market data uses a **Fallback Pattern**: it first attempts the Angel One SmartAPI. On failure (timeout/500), it degrades gracefully to Yahoo Finance.
5. **Response:** Sanitized JSON is returned to the client and elegantly displayed via state-driven UI components.

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bullvision.git
cd bullvision
```

### 2. Install Backend
```bash
cd BACKEND
npm install
cp .env.example .env
```
*(Fill in the required `.env` variables shown below)*

### 3. Install Frontend
```bash
cd ../FRONTEND
npm install
cp .env.example .env
```

## ⚙️ Environment Variables

### Backend (`BACKEND/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | The port the Express server runs on (Default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `JWT_SECRET` | Secure string used to sign user auth tokens |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used for bypassing RLS during admin tasks |
| `ANGEL_API_KEY` | Angel One SmartAPI authentication key |
| `ANGEL_CLIENT_CODE` | Angel One account client code |
| `ANGEL_MPIN` | Angel One account MPIN |
| `ANGEL_TOTP_SECRET` | Authenticator TOTP secret for generating live access tokens |

### Frontend (`FRONTEND/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | URL to the Backend API (Default: `http://localhost:5000`) |

## 🏃 Running the Application

### Development
In the `BACKEND` directory:
```bash
npm run dev
```

In the `FRONTEND` directory:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### Production Build
Frontend:
```bash
npm run build
```
The optimized static files will be generated in `FRONTEND/dist/`.

## 📸 Screenshots

*(Visual placeholders to be replaced after deployment)*
- **Landing Page:** `[screenshot-landing.png]`
- **Dashboard:** `[screenshot-dashboard.png]`
- **Portfolio Management:** `[screenshot-portfolio.png]`
- **Stock Analysis Workspace:** `[screenshot-analysis.png]`

## 🗺 Roadmap

**Completed in V1**
- Secure JWT Authentication
- Supabase Integration (Users, Portfolios, Events)
- Fallback Provider Pattern for Market Data (Angel One → Yahoo)
- Zod Payload Validation
- Responsive Glassmorphic UI

**Planned for V2**
- Machine Learning Prediction Models
- Live WebSockets for real-time tick data
- Options Analysis Dashboard
- AI-driven News Sentiment Insights
- Lazy-loaded Route Chunking

## 🤝 Contributing

We welcome contributions! Please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file for detailed guidelines on our git flow, naming conventions, and code style.

## 📄 License & Author

**Author:** ADITYA ARORA
**License:** ISC License  
