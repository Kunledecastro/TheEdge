# Quick Start Guide

Get the Odds Scraper app running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn

## Steps

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment (Optional)

Create `backend/.env`:
```env
PORT=3001
ODDS_API_KEY=your_key_here  # Optional - app works with mock data without this
NODE_ENV=development
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see: `Server is running on port 3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:5173`

### 4. Use the Application

1. Open http://localhost:5173 in your browser
2. Click "Fetch Odds" to retrieve betting odds
3. Click "Build" to generate accumulator combinations
4. Browse the filtered results (odds 100-1000, 80%+ probability)

## Troubleshooting

**Backend won't start:**
- Check if port 3001 is available
- Verify Node.js version: `node --version` (should be 18+)

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in frontend/.env

**No odds showing:**
- Click "Fetch Odds" button first
- Check browser console for errors
- Backend will use mock data if API key is not set

## Next Steps

- Get a free API key from [The Odds API](https://the-odds-api.com/)
- Read the full [README.md](README.md) for more details
- Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production

