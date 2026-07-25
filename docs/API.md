# BullVision API Reference

Base URL: `http://localhost:5000` (or your deployed domain)

All requests must include the `Content-Type: application/json` header.
All protected routes require the `Authorization: Bearer <JWT_TOKEN>` header.

---

## 🔐 Authentication

### Register a User
- **Method:** `POST`
- **Route:** `/auth/register`
- **Authentication:** None
- **Description:** Creates a new user account.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": { "id": "uuid", "email": "john@example.com", "role": "user" }
  }
  ```
- **Errors:** `400 Bad Request` (Zod validation), `409 Conflict` (Email exists)

### Login
- **Method:** `POST`
- **Route:** `/auth/login`
- **Authentication:** None
- **Description:** Authenticates a user and returns a JWT.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhb...",
    "expiresIn": 86400,
    "user": { "id": "uuid", "email": "john@example.com", "role": "user" }
  }
  ```
- **Errors:** `401 Unauthorized` (Invalid credentials)

### Get Profile
- **Method:** `GET`
- **Route:** `/auth/profile`
- **Authentication:** Required (Bearer Token)
- **Description:** Retrieves the authenticated user's minimal profile.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": { "id": "uuid", "role": "user" }
  }
  ```
- **Errors:** `401 Unauthorized` (Invalid/Expired token)

### Logout
- **Method:** `POST`
- **Route:** `/auth/logout`
- **Authentication:** Required (Bearer Token)
- **Description:** Invalidates the current session (client-side token removal).
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 💼 Portfolio

### Get Holdings
- **Method:** `GET`
- **Route:** `/portfolio/:id` (Note: ID is currently ignored in favor of `req.user.id` for security)
- **Authentication:** Required (Bearer Token)
- **Description:** Retrieves all portfolio holdings for the authenticated user.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "holdings": [
      {
        "id": "uuid",
        "symbol": "RELIANCE",
        "quantity": 10,
        "avg_price": 2500.5,
        "created_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### Add Holding
- **Method:** `POST`
- **Route:** `/portfolio/`
- **Authentication:** Required (Bearer Token)
- **Description:** Adds a new stock holding to the user's portfolio.
- **Request Body:**
  ```json
  {
    "symbol": "TCS",
    "quantity": 5,
    "avg_price": 3200.0
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Holding added successfully",
    "holding": { ... }
  }
  ```
- **Errors:** `400 Bad Request` (Invalid input)

### Update Holding
- **Method:** `PUT`
- **Route:** `/portfolio/:id`
- **Authentication:** Required (Bearer Token)
- **Description:** Updates the quantity or price of a specific holding.
- **Request Body:**
  ```json
  {
    "quantity": 15,
    "avg_price": 3150.0
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Holding updated successfully",
    "holding": { ... }
  }
  ```
- **Errors:** `404 Not Found` (Holding doesn't belong to user)

### Delete Holding
- **Method:** `DELETE`
- **Route:** `/portfolio/:id`
- **Authentication:** Required (Bearer Token)
- **Description:** Removes a holding from the portfolio.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Holding deleted successfully"
  }
  ```

---

## 📈 Market Data

### Search Stocks
- **Method:** `GET`
- **Route:** `/market/search?q=RELIANCE`
- **Authentication:** None
- **Description:** Searches the internal JSON catalog for matching NSE symbols.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "symbol": "RELIANCE-EQ", "name": "RELIANCE INDUSTRIES", "token": "2885", "exch_seg": "NSE" }
    ]
  }
  ```

### Get Stock Quote
- **Method:** `GET`
- **Route:** `/market/quote?symbol=RELIANCE`
- **Authentication:** None
- **Description:** Fetches live market quotes using the provider fallback strategy.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "symbol": "RELIANCE",
      "price": 2550.0,
      "change": 15.5,
      "changePercent": 0.6,
      "fiftyTwoWeekHigh": 2900,
      "fiftyTwoWeekLow": 2100,
      "provider": "AngelOne"
    }
  }
  ```
- **Errors:** `404 Not Found` (Invalid symbol), `502 Bad Gateway` (All providers failed)

### Get Historical Data
- **Method:** `GET`
- **Route:** `/market/history?symbol=RELIANCE&range=1Y`
- **Authentication:** None
- **Description:** Fetches historical price candles. Range can be 1D, 5D, 1M, 3M, 6M, 1Y, 2Y, 5Y, MAX.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "date": "2023-01-01T00:00:00.000Z", "close": 2400.0 },
      { "date": "2023-01-02T00:00:00.000Z", "close": 2420.5 }
    ]
  }
  ```

---

## 📅 Historical Events

### Get All Events
- **Method:** `GET`
- **Route:** `/events/`
- **Authentication:** None
- **Description:** Retrieves all tracked historical market events.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "name": "COVID-19 Crash",
        "startDate": "2020-02-20",
        "endDate": "2020-03-23",
        "category": "GLOBAL_PANDEMIC"
      }
    ]
  }
  ```

### Get Event by ID
- **Method:** `GET`
- **Route:** `/events/:id`
- **Authentication:** None
- **Description:** Retrieves details for a specific event.

### Get Events by Category
- **Method:** `GET`
- **Route:** `/events/category/:category`
- **Authentication:** None
- **Description:** Filters events by category string.

---

## 🔍 Analytics

### Analyze All Events for Symbol
- **Method:** `GET`
- **Route:** `/api/event-analysis/:symbol/all`
- **Authentication:** None
- **Description:** Dynamically calculates risk, drawdown, and recovery metrics for a given stock across all historical events.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "symbol": "RELIANCE",
    "data": [
      {
        "event": { "id": "uuid", "name": "COVID-19 Crash" },
        "status": "SUCCESS",
        "analytics": {
          "drawdown": { "drawdownPercentage": 35.5 },
          "recovery": { "recovered": true, "recoveryDays": 120 },
          "volatility": { "volatility": 0.05 },
          "scores": {
            "resilience": { "interpretation": "High Risk" }
          }
        }
      }
    ]
  }
  ```

### Analyze Specific Event
- **Method:** `GET`
- **Route:** `/api/event-analysis/:symbol/:eventId`
- **Authentication:** None
- **Description:** Calculates analytics for a single specific event and stock.
