import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

let db: SqlJsDatabase;
let SQL: any;

export const initializeDatabase = async (): Promise<void> => {
  // Initialize SQL.js
  SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      credit_limit REAL DEFAULT 0,
      payment_terms INTEGER DEFAULT 30,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Invoices table
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      due_date DATE NOT NULL,
      issue_date DATE NOT NULL,
      status TEXT DEFAULT 'pending',
      aging_bucket TEXT,
      days_overdue INTEGER DEFAULT 0,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  // Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_date DATETIME NOT NULL,
      payment_method TEXT,
      transaction_id TEXT,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    )
  `);

  // Reminders table
  db.run(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      channel TEXT DEFAULT 'email',
      message TEXT NOT NULL,
      sent_date DATETIME,
      status TEXT DEFAULT 'pending',
      recipient TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Alerts table
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    )
  `);

  // Insert default settings
  const defaultSettings = [
    { key: 'high_value_threshold', value: '10000', description: 'Threshold for high-value invoice alerts' },
    { key: 'reminder_day_7', value: 'true', description: 'Send reminder at 7 days overdue' },
    { key: 'reminder_day_30', value: 'true', description: 'Send reminder at 30 days overdue' },
    { key: 'reminder_day_60', value: 'true', description: 'Send escalation at 60 days overdue' },
    { key: 'aging_bucket_1', value: '0-30', description: 'First aging bucket range' },
    { key: 'aging_bucket_2', value: '31-60', description: 'Second aging bucket range' },
    { key: 'aging_bucket_3', value: '61-90', description: 'Third aging bucket range' },
    { key: 'aging_bucket_4', value: '90+', description: 'Fourth aging bucket range' }
  ];

  defaultSettings.forEach(setting => {
    try {
      db.run(`INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)`,
        [setting.key, setting.value, setting.description]);
    } catch (error) {
      // Setting might already exist
    }
  });

  // Save database to file
  saveDatabase();

  console.log('Database tables created successfully');
};

export const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

// Helper functions to mimic better-sqlite3 API
export const prepare = (sql: string) => {
  return {
    run: (...params: any[]) => {
      db.run(sql, params);
      saveDatabase();
      return { lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0] || 0 };
    },
    get: (...params: any[]) => {
      const result = db.exec(sql, params);
      if (result.length === 0) return undefined;
      const columns = result[0].columns;
      const values = result[0].values[0];
      if (!values) return undefined;
      const row: any = {};
      columns.forEach((col, i) => {
        row[col] = values[i];
      });
      return row;
    },
    all: (...params: any[]) => {
      const result = db.exec(sql, params);
      if (result.length === 0) return [];
      const columns = result[0].columns;
      const rows = result[0].values.map(values => {
        const row: any = {};
        columns.forEach((col, i) => {
          row[col] = values[i];
        });
        return row;
      });
      return rows;
    }
  };
};

export default { prepare };
