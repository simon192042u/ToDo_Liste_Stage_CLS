const express = require('express');
const cors = require('cors');
const db = require('./database');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Login & Health (wie gehabt)
app.get('/health', (req, res) => res.json({ status: "UP" }));
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (user && password === "1234") res.json({ message: "Erfolgreich", user });
        else res.status(401).json({ message: "Fehler" });
    });
});

// 2. READ (Alle Todos)
app.get('/todos/:userId', (req, res) => {
    db.all("SELECT * FROM todos WHERE user_id = ?", [req.params.userId], (err, rows) => res.json(rows));
});

// 3. CREATE (Neu)
app.post('/todos', (req, res) => {
    const { title, user_id } = req.body;
    db.run("INSERT INTO todos (title, completed, user_id) VALUES (?, 0, ?)", [title, user_id], function() {
        res.json({ id: this.lastID, title, completed: 0 });
    });
});

// 4. UPDATE (Abhaken) -> NEU
app.put('/todos/:id', (req, res) => {
    const { completed } = req.body;
    db.run("UPDATE todos SET completed = ? WHERE id = ?", [completed ? 1 : 0, req.params.id], () => res.json({ ok: true }));
});

// 5. DELETE (Löschen) -> NEU
app.delete('/todos/:id', (req, res) => {
    db.run("DELETE FROM todos WHERE id = ?", [req.params.id], () => res.json({ ok: true }));
});

app.listen(3000, () => console.log('Server läuft auf Port 3000'));