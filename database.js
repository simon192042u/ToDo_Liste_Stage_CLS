const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todo_app.db');

db.serialize(() => {
    // Tabellen erstellen
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, role TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))`);

    // Testdaten (Seeds) - Entspricht deinen Personas
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
            db.run("INSERT INTO users (email, role) VALUES ('marc@zli.ch', 'Mitglied')");
            db.run("INSERT INTO users (email, role) VALUES ('admin@zli.ch', 'Administrator')");
            db.run("INSERT INTO todos (title, completed, user_id) VALUES ('Doku abgeben', 0, 1)");
            console.log("Datenbank bereit und Testdaten geladen.");
        }
    });
});

module.exports = db;