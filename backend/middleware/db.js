const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../data/wildlife.db');

const db = new Database(DB_PATH);

// Performance / correctness pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ──────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    email     TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,
    role      TEXT    NOT NULL DEFAULT 'Ranger',
    joinDate  TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS observations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    userId      INTEGER NOT NULL,
    speciesName TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    location    TEXT    NOT NULL,
    type        TEXT    NOT NULL,
    notes       TEXT    NOT NULL DEFAULT '',
    createdAt   TEXT    NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reports (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    userId      INTEGER NOT NULL,
    reportType  TEXT    NOT NULL,
    species     TEXT    NOT NULL DEFAULT '',
    location    TEXT    NOT NULL,
    coordinates TEXT,
    date        TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    createdAt   TEXT    NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS wildlife (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    population INTEGER NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'Unknown'
  );
`);

// ── Seed data (only if tables are empty) ────────────────────────────────────
const seedDb = db.transaction(() => {
  if (db.prepare('SELECT COUNT(*) as n FROM users').get().n === 0) {
    // Password is "password" – same bcrypt hash used in the original JSON seed
    const hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    db.prepare(`INSERT INTO users (id, name, email, password, role, joinDate) VALUES (?,?,?,?,?,?)`)
      .run(1, 'Admin', 'admin@wildlifetracker.com', hash, 'Administrator', '2026-01-01');
    db.prepare(`INSERT INTO users (id, name, email, password, role, joinDate) VALUES (?,?,?,?,?,?)`)
      .run(2, 'John Doe', 'john@example.com', hash, 'Ranger', '2026-01-15');
  }

  if (db.prepare('SELECT COUNT(*) as n FROM observations').get().n === 0) {
    db.prepare(`INSERT INTO observations (userId, speciesName, date, location, type, notes, createdAt)
                VALUES (?,?,?,?,?,?,?)`)
      .run(2, 'African Elephant', '2026-02-07', 'Maasai Mara', 'General Sighting',
        'A large herd of around 15 elephants was seen moving toward the southern riverbank during the golden hour.',
        '2026-02-07T09:00:00.000Z');
    db.prepare(`INSERT INTO observations (userId, speciesName, date, location, type, notes, createdAt)
                VALUES (?,?,?,?,?,?,?)`)
      .run(2, 'Black Rhino', '2026-02-05', 'Nyeri', 'Injured Animal',
        'Spotted near the edge of the conservancy. It appeared to have a slight limp on its left front leg. Reported to local rangers.',
        '2026-02-05T09:00:00.000Z');
  }

  if (db.prepare('SELECT COUNT(*) as n FROM reports').get().n === 0) {
    db.prepare(`INSERT INTO reports (userId, reportType, species, location, coordinates, date, description, createdAt)
                VALUES (?,?,?,?,?,?,?,?)`)
      .run(2, 'General Sighting', 'African Elephant', 'Maasai Mara',
        JSON.stringify({ lat: -1.5, lng: 35.1 }),
        '2026-02-07T08:30:00', 'Large herd spotted near the river.',
        '2026-02-07T09:00:00.000Z');
  }

  if (db.prepare('SELECT COUNT(*) as n FROM wildlife').get().n === 0) {
    [
      [1, 'Elephant', 120, 'Vulnerable'],
      [2, 'Lion',     50,  'Vulnerable'],
      [3, 'Rhino',    35,  'Critically Endangered'],
      [4, 'Giraffe',  60,  'Vulnerable'],
    ].forEach(([id, name, pop, status]) => {
      db.prepare('INSERT INTO wildlife (id, name, population, status) VALUES (?,?,?,?)').run(id, name, pop, status);
    });
  }
});

seedDb();

module.exports = db;

