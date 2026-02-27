# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Two-service app (React frontend + Express backend) for scraping betting odds and generating accumulator combinations. See `README.md` and `QUICKSTART.md` for standard setup/run commands.

### Services

| Service | Dev command | Port | Directory |
|---------|------------|------|-----------|
| Backend (Express API) | `npm run dev` | 3001 | `backend/` |
| Frontend (Vite) | `npm run dev` | 5173 | `frontend/` |

### Key caveats

- **Nodemon restart loop**: The backend's `nodemon` watches `*.json` files by default. The storage service writes to `backend/database/data.json` on startup, causing an infinite restart loop. The `backend/nodemon.json` config restricts watching to `src/` only and ignores `database/` and `dist/`. If this file is missing, create it with `{"watch":["src"],"ext":"ts,json","ignore":["database/*","dist/*"]}`.
- **Mock data mode**: When `ODDS_API_KEY` is not set in `backend/.env`, the backend uses built-in mock data. The app is fully functional without an API key.
- **dotenv load order**: The `OddsScraperService` singleton is created at import time before `dotenv.config()` runs. The API key is read lazily via a getter to work around this.
- **Lint**: `npm run lint` in `frontend/` runs ESLint. The backend has no lint script. There are pre-existing lint errors in the frontend code (5 errors: 1 `set-state-in-effect` and 4 `no-explicit-any`).
- **Build**: `npm run build` works in both `backend/` (tsc) and `frontend/` (tsc + vite build).
- **No automated tests**: Backend test script is a placeholder (`echo "Error: no test specified"`). Frontend has no test script.
- **Storage**: JSON file-based at `backend/database/data.json`. No database server required.

### Deployment

- **Backend** → Render free tier. Blueprint at `render.yaml`. Set `ODDS_API_KEY` and `FRONTEND_URL` env vars in Render dashboard.
- **Frontend** → Vercel free tier. Config at `frontend/vercel.json`. Set `VITE_API_URL` env var to point to the Render backend URL + `/api`.
- CORS is configured via `FRONTEND_URL` env var in the backend (defaults to `*`).
