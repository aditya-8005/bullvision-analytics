# BullVision Deployment Guide

BullVision is designed to be easily deployed to modern cloud hosting providers. It relies on standard Node.js environments and static asset hosting.

---

## 1. Prerequisites

Before deploying, you must provision:
1. **Supabase Project:** For PostgreSQL database and authentication.
2. **Angel One SmartAPI Account:** For live market data.

---

## 2. Environment Variables

Both the frontend and backend require specific environment variables to function in production.

### Backend Production Environment
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secure_random_string

SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

ANGEL_API_KEY=[YOUR-ANGEL-API-KEY]
ANGEL_CLIENT_CODE=[YOUR-CLIENT-CODE]
ANGEL_MPIN=[YOUR-MPIN]
ANGEL_TOTP_SECRET=[YOUR-TOTP-SECRET]
```
*Note: Never expose the `SUPABASE_SERVICE_ROLE_KEY` in client-side code.*

### Frontend Production Environment
```env
VITE_API_BASE_URL=https://api.bullvision.com
```
*Note: Replace `https://api.bullvision.com` with the actual URL of your deployed backend.*

---

## 3. Backend Deployment (Node.js API)

The backend is a standard Express application and can be hosted on platforms like **Render**, **Railway**, or **Heroku**.

### Option A: Render / Railway (Recommended)
1. Connect your GitHub repository to Render/Railway.
2. Select the `BACKEND` directory as the root folder.
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Input all the required Backend Environment Variables in the provider's dashboard.
6. Deploy.

### Option B: VPS / Docker / PM2
1. Clone the repository to your server.
2. `cd BACKEND`
3. `npm install`
4. Run using PM2: `pm2 start index.js --name bullvision-api`

---

## 4. Frontend Deployment (Static SPA)

The frontend is a Vite-built React application. It compiles to static HTML/CSS/JS and is best hosted on **Vercel**, **Netlify**, or **Render**.

### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel.
2. Set the **Root Directory** to `FRONTEND`.
3. Vercel will automatically detect Vite. 
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the `VITE_API_BASE_URL` environment variable pointing to your deployed backend URL.
5. Deploy.

*Note for React Router:* Vercel handles SPA routing automatically when it detects Vite, routing all unknown paths to `index.html`.

### Option B: Nginx (VPS)
If hosting manually via Nginx, ensure you configure URL rewrites for React Router.
1. `cd FRONTEND`
2. `npm run build`
3. Copy the contents of the `dist/` folder to `/var/www/bullvision`.
4. Update `nginx.conf`:
```nginx
server {
    listen 80;
    server_name bullvision.com;
    root /var/www/bullvision;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 5. Production Checklist

Before announcing the launch, verify the following:

- [ ] **CORS is configured:** Ensure the backend `cors` configuration in `index.js` explicitly allows your frontend production domain (currently it defaults to permissive).
- [ ] **Secrets are secure:** Ensure `.env` is in `.gitignore` and no API keys are hardcoded.
- [ ] **JWT Secret is strong:** Do not use `test-secret` or default strings. Generate a random 64-character hex string.
- [ ] **Rate Limiting:** Ensure `express-rate-limit` is active on the auth endpoints to prevent brute-force attacks.
- [ ] **Build Validation:** Run `npm run build` locally first to ensure TypeScript doesn't throw hidden errors.
- [ ] **Logs:** Check backend logs to confirm the Angel One provider connects successfully at startup.
