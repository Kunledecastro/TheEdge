# Odds Scraper - Accumulator Finder

A web application that scrapes betting odds from free APIs, identifies accumulator combinations with odds between +100 to +1000 (American format), and filters selections based on an 80% success probability threshold.

## Features

- **Odds Scraping**: Fetches odds from The Odds API (with mock data fallback)
- **Accumulator Builder**: Generates combinations of bets with combined odds in the 100-1000 range
- **Probability Calculator**: Filters selections to only those with 80%+ success probability
- **Modern UI**: Clean, responsive dashboard with dark mode support
- **Real-time Updates**: View current odds and accumulator combinations

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- TanStack Query (React Query) for API state management
- Recharts (for future chart visualizations)

### Backend
- Node.js with Express.js (TypeScript)
- Axios for HTTP requests
- JSON file-based storage (can be migrated to SQLite/PostgreSQL)

### Data Sources
- The Odds API (free tier: 500 requests/month)
- Mock data fallback for development

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) The Odds API key from https://the-odds-api.com/

### Installation

1. Clone the repository and navigate to the project:

```bash
cd odds-scraper-app
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Configuration

1. Create a `.env` file in the `backend` directory:

```env
PORT=3001
ODDS_API_KEY=your_odds_api_key_here
NODE_ENV=development
```

**Note**: If you don't have an API key, the app will use mock data for development.

2. (Optional) Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

2. Start the frontend development server (in a new terminal):

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

3. Open your browser and navigate to the frontend URL.

## Usage

1. **Fetch Odds**: Click "Fetch Odds" to retrieve current betting odds for the selected sport
2. **Build Accumulators**: Click "Build" to generate accumulator combinations
3. **View Results**: Browse the filtered accumulator combinations in the table
4. **View Details**: Click on any accumulator to see detailed information

## API Endpoints

### Odds
- `GET /api/odds` - Fetch odds from API
- `GET /api/odds/stored` - Get stored odds from database
- `GET /api/odds/sports` - Get available sports

### Accumulators
- `GET /api/accumulators` - Get filtered accumulator combinations
- `POST /api/accumulators/calculate` - Calculate custom accumulator
- `GET /api/accumulators/stored` - Get stored accumulators

### Statistics
- `GET /api/stats` - Get historical statistics
- `POST /api/stats` - Add/update historical statistics
- `GET /api/stats/probability/:oddsId` - Get probability breakdown

## Project Structure

```
odds-scraper-app/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # React Query hooks
│   │   ├── services/       # API service
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # TypeScript interfaces
│   │   └── utils/          # Utility functions
│   └── package.json
└── database/
    └── schema.sql          # Database schema (for future migration)
```

## Free Resources Used

- **APIs**: The Odds API (free tier)
- **Fonts**: Google Fonts (Inter, JetBrains Mono)
- **UI Components**: Custom components with Tailwind CSS
- **Hosting**: Ready for Vercel (frontend) and Railway/Render (backend)

## Development Notes

- The app uses JSON file-based storage by default. For production, consider migrating to SQLite or PostgreSQL.
- Mock data is provided when The Odds API key is not configured.
- Rate limiting is implemented to respect free API tier limits (500 requests/month).

## License

MIT

# TheEdge
