import { promises as fs } from 'fs';
import path from 'path';
import { Odds, Accumulator, HistoricalStats } from '../models/Odds.model';

interface Database {
  odds: Odds[];
  accumulators: Accumulator[];
  historicalStats: HistoricalStats[];
}

class StorageService {
  private dbPath: string;
  private data: Database = {
    odds: [],
    accumulators: [],
    historicalStats: [],
  };

  constructor() {
    this.dbPath = path.join(__dirname, '../../database/data.json');
    this.initializeDatabase();
  }

  /**
   * Initialize database file if it doesn't exist
   */
  private async initializeDatabase(): Promise<void> {
    try {
      const dbDir = path.dirname(this.dbPath);
      await fs.mkdir(dbDir, { recursive: true });
      
      try {
        const fileContent = await fs.readFile(this.dbPath, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (error) {
        // File doesn't exist, use default empty database
        await this.save();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  /**
   * Save data to file
   */
  private async save(): Promise<void> {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Odds operations
  async saveOdds(odds: Odds[]): Promise<void> {
    // Add IDs if not present
    odds.forEach((odd, index) => {
      if (!odd.id) {
        odd.id = Date.now() + index;
      }
    });
    
    this.data.odds = odds;
    await this.save();
  }

  async getOdds(): Promise<Odds[]> {
    return this.data.odds;
  }

  async addOdds(odds: Odds): Promise<Odds> {
    if (!odds.id) {
      odds.id = Date.now();
    }
    this.data.odds.push(odds);
    await this.save();
    return odds;
  }

  // Accumulator operations
  async saveAccumulators(accumulators: Accumulator[]): Promise<void> {
    accumulators.forEach((acc, index) => {
      if (!acc.id) {
        acc.id = Date.now() + index;
      }
    });
    
    this.data.accumulators = accumulators;
    await this.save();
  }

  async getAccumulators(): Promise<Accumulator[]> {
    return this.data.accumulators;
  }

  async addAccumulator(accumulator: Accumulator): Promise<Accumulator> {
    if (!accumulator.id) {
      accumulator.id = Date.now();
    }
    this.data.accumulators.push(accumulator);
    await this.save();
    return accumulator;
  }

  // Historical stats operations
  async saveHistoricalStats(stats: HistoricalStats[]): Promise<void> {
    stats.forEach((stat, index) => {
      if (!stat.id) {
        stat.id = Date.now() + index;
      }
    });
    
    this.data.historicalStats = stats;
    await this.save();
  }

  async getHistoricalStats(): Promise<HistoricalStats[]> {
    return this.data.historicalStats;
  }

  async addHistoricalStat(stat: HistoricalStats): Promise<HistoricalStats> {
    if (!stat.id) {
      stat.id = Date.now();
    }
    this.data.historicalStats.push(stat);
    await this.save();
    return stat;
  }

  /**
   * Clear all data (for testing)
   */
  async clear(): Promise<void> {
    this.data = {
      odds: [],
      accumulators: [],
      historicalStats: [],
    };
    await this.save();
  }
}

export default new StorageService();

