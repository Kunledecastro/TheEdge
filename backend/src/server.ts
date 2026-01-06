import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import oddsRoutes from './routes/odds.routes';
import accumulatorsRoutes from './routes/accumulators.routes';
import statsRoutes from './routes/stats.routes';
import probabilityCalculator from './services/probabilityCalculator.service';
import storage from './services/storage.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // In production, set FRONTEND_URL
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Initialize probability calculator with stored stats
(async () => {
  try {
    const stats = await storage.getHistoricalStats();
    if (stats.length === 0) {
      // Initialize with mock stats for development
      probabilityCalculator.initializeMockStats();
      const mockStats = await storage.getHistoricalStats();
      if (mockStats.length === 0) {
        // Save mock stats if storage is empty
        const mockData = [
          {
            team: 'Manchester United',
            sport: 'Soccer',
            winRate: 65,
            recentForm: 'WWLWW',
            lastUpdated: new Date(),
          },
          {
            team: 'Liverpool',
            sport: 'Soccer',
            winRate: 70,
            recentForm: 'WLWWW',
            lastUpdated: new Date(),
          },
          {
            team: 'Lakers',
            sport: 'Basketball',
            winRate: 60,
            recentForm: 'WWLWL',
            lastUpdated: new Date(),
          },
          {
            team: 'Warriors',
            sport: 'Basketball',
            winRate: 75,
            recentForm: 'WWWWL',
            lastUpdated: new Date(),
          },
        ];
        for (const stat of mockData) {
          await storage.addHistoricalStat(stat as any);
        }
      }
    } else {
      probabilityCalculator.loadHistoricalStats(stats);
    }
  } catch (error) {
    console.error('Error initializing stats:', error);
    probabilityCalculator.initializeMockStats();
  }
})();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Odds Scraper API is running' });
});

app.use('/api/odds', oddsRoutes);
app.use('/api/accumulators', accumulatorsRoutes);
app.use('/api/stats', statsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

