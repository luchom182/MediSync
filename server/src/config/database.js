const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Enforce Foreign Keys & create tables
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');

  // Tabla USERS
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'paciente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla CITAS
  db.run(`
    CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      especialidad TEXT NOT NULL,
      doctor TEXT NOT NULL,
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      lugar TEXT NOT NULL,
      estado TEXT CHECK(estado IN ('Pendiente', 'Completada', 'Cancelada')) DEFAULT 'Pendiente',
      notas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Tabla DOCUMENTOS (Checklist por Cita)
  db.run(`
    CREATE TABLE IF NOT EXISTS documentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cita_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      categoria TEXT DEFAULT 'Requisito',
      completado INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE
    );
  `);
});

// Async Database Helper
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

module.exports = {
  db,
  query,
  get,
  run
};
