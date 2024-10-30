import Database from "better-sqlite3";

const db =
  process.env.NODE_ENV === "development"
    ? new Database("lib/cache-dev.db")
    : new Database("lib/cache.db");

db.pragma("journal_mode = WAL");
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    todo TEXT,
    timestamp INTEGER
  )
`
).run();

export default db;
