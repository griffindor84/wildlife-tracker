const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// NOTE: Synchronous I/O is used here intentionally for simplicity.
// This JSON file is a lightweight development data store.
// For production, replace these helpers with a proper database driver
// (e.g. PostgreSQL via `pg`, MongoDB via `mongoose`).
function read() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
