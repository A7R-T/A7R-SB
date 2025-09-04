//database.js
const database = require('better-sqlite3')

const db = new database('A7R-SB.db')


db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  )
`).run();

function saveNote(title, content) {
    const stmt = db.prepare(`INSERT INTO notes (title, content) VALUES (?, ?)`);
    const info = stmt.run(title, content);
    return info.lastInsertRowid;
}

function loadNotes() {
    const stmt = db.prepare(`SELECT * FROM notes`);
    return stmt.all();
}

function updateNote(id, title, content) {
    const stmt = db.prepare(`UPDATE notes SET title = ?, content = ? WHERE id = ?`);
    stmt.run(title, content, id);
}

module.exports = { saveNote, loadNotes, updateNote };