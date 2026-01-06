import { Router } from 'express';
import storage from '../services/storage.service';
import probabilityCalculator from '../services/probabilityCalculator.service';

const router = Router();

/**
 * GET /api/stats
 * Get historical statistics
 */
router.get('/', async (req, res) => {
  try {
    const stats = await storage.getHistoricalStats();
    res.json({
      success: true,
      data: stats,
      count: stats.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve statistics',
    });
  }
});

/**
 * POST /api/stats
 * Add or update historical statistics
 */
router.post('/', async (req, res) => {
  try {
    const { team, sport, winRate, recentForm, headToHead } = req.body;

    if (!team || !sport || winRate === undefined) {
      return res.status(400).json({
        success: false,
        error: 'team, sport, and winRate are required',
      });
    }

    const stat = await storage.addHistoricalStat({
      team,
      sport,
      winRate: parseFloat(winRate),
      recentForm: recentForm || '',
      headToHead: headToHead || {},
      lastUpdated: new Date(),
    });

    // Reload stats in probability calculator
    const allStats = await storage.getHistoricalStats();
    probabilityCalculator.loadHistoricalStats(allStats);

    res.json({
      success: true,
      data: stat,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save statistics',
    });
  }
});

/**
 * GET /api/stats/probability/:oddsId
 * Get probability breakdown for a specific odds selection
 */
router.get('/probability/:oddsId', async (req, res) => {
  try {
    const oddsId = req.params.oddsId;
    const odds = await storage.getOdds();
    const selection = odds.find(o => o.id?.toString() === oddsId);

    if (!selection) {
      return res.status(404).json({
        success: false,
        error: 'Odds selection not found',
      });
    }

    const breakdown = probabilityCalculator.getProbabilityBreakdown(selection);

    res.json({
      success: true,
      data: {
        selection,
        breakdown,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate probability',
    });
  }
});

export default router;

