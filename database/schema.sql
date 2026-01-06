-- Database schema for Odds Scraper App
-- Note: Currently using JSON file storage, but this schema can be used for SQLite/PostgreSQL migration

-- Odds table
CREATE TABLE IF NOT EXISTS odds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    sport TEXT NOT NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    selection TEXT NOT NULL,
    american_odds INTEGER NOT NULL,
    decimal_odds REAL NOT NULL,
    bookmaker TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Accumulators table
CREATE TABLE IF NOT EXISTS accumulators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combined_american_odds INTEGER NOT NULL,
    combined_decimal_odds REAL NOT NULL,
    total_probability REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Accumulator selections (many-to-many relationship)
CREATE TABLE IF NOT EXISTS accumulator_selections (
    accumulator_id INTEGER NOT NULL,
    odds_id INTEGER NOT NULL,
    FOREIGN KEY (accumulator_id) REFERENCES accumulators(id),
    FOREIGN KEY (odds_id) REFERENCES odds(id),
    PRIMARY KEY (accumulator_id, odds_id)
);

-- Historical statistics table
CREATE TABLE IF NOT EXISTS historical_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team TEXT NOT NULL,
    sport TEXT NOT NULL,
    win_rate REAL NOT NULL,
    recent_form TEXT,
    last_updated DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team, sport)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_odds_game_id ON odds(game_id);
CREATE INDEX IF NOT EXISTS idx_odds_sport ON odds(sport);
CREATE INDEX IF NOT EXISTS idx_odds_american_odds ON odds(american_odds);
CREATE INDEX IF NOT EXISTS idx_accumulators_odds_range ON accumulators(combined_american_odds);
CREATE INDEX IF NOT EXISTS idx_historical_stats_team ON historical_stats(team);

