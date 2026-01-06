import { Router } from 'express';
import oddsScraper from '../services/oddsScraper.service';
import storage from '../services/storage.service';

const router = Router();

/**
 * GET /api/odds
 * Fetch current odds from API and store in database
 */
router.get('/', async (req, res) => {
  try {
    const sport = (req.query.sport as string) || 'soccer_epl';
    const odds = await oddsScraper.fetchOdds(sport);
    
    // Save to storage
    await storage.saveOdds(odds);
    
    res.json({
      success: true,
      data: odds,
      count: odds.length,
    });
  } catch (error: any) {
    console.error('Error fetching odds:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch odds',
    });
  }
});

/**
 * GET /api/odds/stored
 * Get odds from database (without fetching from API)
 */
router.get('/stored', async (req, res) => {
  try {
    const odds = await storage.getOdds();
    res.json({
      success: true,
      data: odds,
      count: odds.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve odds',
    });
  }
});

/**
 * GET /api/odds/sports
 * Get available sports
 */
router.get('/sports', async (req, res) => {
  try {
    const sports = await oddsScraper.getAvailableSports();
    res.json({
      success: true,
      data: sports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch sports',
    });
  }
});

export default router;

