const db = require("./db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      event_date TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Table events créée");


  db.run(`
  CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
  )
`);

console.log("Table event_registrations créée");

db.run(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    member_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Table members créée");


db.run(`
  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    website TEXT,
    logo TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Table partners créée");


});