# 📈 BullVision Backend

Production-ready backend for **BullVision**, an Indian Stock Market Analytics Platform.

BullVision helps users analyze Indian stocks using live market data, historical price data, and event-driven analytics. The platform is designed with a scalable and modular backend architecture following production-grade engineering practices.

---

# 🚀 Features

## ✅ Current

- Live Market Quote API
- Instrument Master Loader
- Instrument Search
- In-Memory Instrument Cache
- Angel One SmartAPI Integration
- Request Validation
- Global Error Handling
- Modular Backend Architecture

## 🚧 Upcoming

- Historical Market Data
- Event-Based Stock Analytics
- Portfolio Management
- User Authentication
- Watchlists
- Stock Comparison
- AI-powered Insights (Future Version)

---

# 🏗️ Architecture

```text
Client
    │
    ▼
Routes
    │
    ▼
Validators
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Providers
    │
    ▼
External APIs / Database
    │
    ▼
Mappers
    │
    ▼
BullVision Response
```

---

# 📂 Project Structure

```text
src/
│
├── config/
├── errors/
├── middlewares/
├── market/
│   ├── controllers/
│   ├── providers/
│   ├── services/
│   ├── validators/
│   ├── loaders/
│   ├── mappers/
│   ├── data/
│   └── utils/
│
├── routes/
│
└── tests/
```

---

# 🛠️ Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### External APIs

- Angel One SmartAPI

### Tools

- Git
- GitHub
- Postman

---

# ⚙️ Getting Started

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

Required variables:

```env
PORT=

MONGO_URI=

ANGEL_API_KEY=
ANGEL_CLIENT_CODE=
ANGEL_MPIN=
ANGEL_TOTP_SECRET=
```

---

# 📡 API Endpoints

## Search Stocks

```http
GET /market/search?q=RELIANCE
```

---

## Live Quote

```http
GET /market/quote?symbol=RELIANCE
```

---

# 🗺️ Roadmap

- [x] Backend Architecture
- [x] Instrument Master Loader
- [x] Instrument Search
- [x] Live Quote API
- [x] Global Error Handling
- [ ] Historical Market Data
- [ ] Event Analytics Engine
- [ ] Portfolio Management
- [ ] User Authentication
- [ ] Frontend Dashboard

---

# 📌 Current Status

BullVision Backend is currently under active development.

The project follows a production-oriented architecture with emphasis on scalability, maintainability, and clean software engineering practices.

---

# 👨‍💻 Author

**Aditya Arora**

Built as a long-term engineering project to learn backend architecture, system design, and financial market analytics.
