# UAF Aggregate Calculator — Backend

Saves every calculator submission permanently to MongoDB, and powers the
password-protected admin dashboard (`admin.html`).

## 1. Deploy to Railway (same as your iAWAiSH backend)

1. Push this `aggregate-backend` folder to a new GitHub repo (or a subfolder
   of an existing one).
2. In Railway: **New Project → Deploy from GitHub repo** → select it.
3. Add environment variables in Railway's **Variables** tab:
   - `MONGO_URI` — your MongoDB connection string (you can reuse your
     existing MongoDB Atlas cluster, just use a different database name,
     e.g. `aggregate-calculator`)
   - `ADMIN_PASSWORD` — set this to `421806`, or better, change it to
     something private only you know
4. Railway will run `npm install` and `npm start` automatically.
5. Once deployed, copy the public URL Railway gives you
   (e.g. `https://aggregate-backend-production.up.railway.app`).

## 2. Point the frontend at your backend

In **`index.html`** and **`admin.html`**, find this line near the top of the
`<script>` section:

```javascript
const API_BASE = "https://YOUR-BACKEND-URL.up.railway.app";
```

Replace it with the real Railway URL from step 1, in both files.

## 3. Lock down CORS (recommended before going fully live)

Right now `server.js` uses `app.use(cors())`, which allows requests from any
website. Once your calculator is live on its final domain, tighten this in
`server.js`:

```javascript
app.use(cors({ origin: "https://your-calculator-domain.com" }));
```

## 4. How data flows

- Every time someone successfully calculates their aggregate (or their
  required entry test score), the frontend sends that data to
  `POST /api/submissions` — silently, in the background, without
  interrupting their result.
- Data is stored permanently in MongoDB. It survives refreshes, redeploys,
  and new visitors — it only goes away if you delete it.
- `admin.html` asks for a password (`421806` by default), then calls
  `GET /api/admin/submissions` with that password in a request header to
  fetch everything. Wrong password = server refuses to send any data.

## Security note

This is a lightweight setup appropriate for a personal/student project, not
a bank-grade system. The password check happens on the server (not just
hidden in frontend code), which is the important part — but there's no
rate-limiting on login attempts. If you want it hardened further later
(e.g. JWT sessions, login attempt limits), that's a reasonable next step
once the project has real traffic.
