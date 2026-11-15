
const Database = require("better-sqlite3");
const path = require("path");

// Connect to SQLite database
const dbPath = path.join(__dirname, "sunnycourts.db");
const db = new Database(dbPath);

// Enable foreign key support
db.pragma("foreign_keys = ON");

// Create Players table
db.exec(`
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
`);

// Create Courts table
db.exec(`
    CREATE TABLE IF NOT EXISTS courts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sport TEXT NOT NULL
    );
`);

// Create Reservations table
db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        court_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active'
            CHECK (status IN ('active', 'returned')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (player_id)
            REFERENCES players(id),

        FOREIGN KEY (court_id)
            REFERENCES courts(id)
    );
`);

// Prevent more than one active reservation per court
db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS
    one_active_reservation_per_court
    ON reservations(court_id)
    WHERE status = 'active';
`);

// Insert sample players and courts
const seedData = db.transaction(() => {

    const insertPlayer = db.prepare(`
        INSERT OR IGNORE INTO players (id, name)
        VALUES (?, ?)
    `);

    insertPlayer.run(1, "Asha");
    insertPlayer.run(2, "Ravi");

    const insertCourt = db.prepare(`
        INSERT OR IGNORE INTO courts (id, name, sport)
        VALUES (?, ?, ?)
    `);

    insertCourt.run(1, "Court 1", "Badminton");
    insertCourt.run(2, "Court 2", "Tennis");
    insertCourt.run(3, "Court 3", "Basketball");
});

seedData();

console.log("SQLite database connected successfully!");
console.log("Players, Courts and Reservations tables are ready!");

// Export database connection
module.exports = db;
