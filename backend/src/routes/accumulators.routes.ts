import { Router } from 'express';
import accumulatorBuilder from '../services/accumulatorBuilder.service';
import storage from '../services/storage.service';
import probabilityCalculator from '../services/probabilityCalculator.service';

const router = Router();

/**
 * GET /api/accumulators
 * Get filtered accumulator combinations (100-1000 odds, 80% probability)
 */
router.get('/', async (req, res) => {
  try {
    const minSelections = parseInt(req.query.minSelections as string) || 2;
    const maxSelections = parseInt(req.query.maxSelections as string) || 4;
    
    // Get odds from storage
    const odds = await storage.getOdds();
    
    if (odds.length === 0) {
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: 'No odds available. Please fetch odds first.',
      });
    }

    // Build accumulators
    const accumulators = accumulatorBuilder.buildAccumulators(
      odds,
      minSelections,
      maxSelections
    );

    // Save to storage
    await storage.saveAccumulators(accumulators);

    res.json({
      success: true,
      data: accumulators,
      count: accumulators.length,
    });
  } catch (error: any) {
    console.error('Error building accumulators:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to build accumulators',
    });
  }
});

/**
 * POST /api/accumulators/calculate
 * Calculate probability for a custom accumulator combination
 */
router.post('/calculate', async (req, res) => {
  try {
    const { selectionIds } = req.body;

    if (!selectionIds || !Array.isArray(selectionIds)) {
      return res.status(400).json({
        success: false,
        error: 'selectionIds must be an array',
      });
    }

    const odds = await storage.getOdds();
    const accumulator = accumulatorBuilder.calculateCustomAccumulator(selectionIds, odds);

    if (!accumulator) {
      return res.status(400).json({
        success: false,
        error: 'Invalid accumulator combination',
      });
    }

    res.json({
      success: true,
      data: accumulator,
    });
  } catch (error: any) {
    console.error('Error calculating accumulator:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate accumulator',
    });
  }
});

/**
 * GET /api/accumulators/stored
 * Get stored accumulators from database
 */
router.get('/stored', async (req, res) => {
  try {
    const accumulators = await storage.getAccumulators();
    res.json({
      success: true,
      data: accumulators,
      count: accumulators.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve accumulators',
    });
  }
});

export default router;

