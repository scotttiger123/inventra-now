import SQLite from 'react-native-sqlite-storage';

// Open the database
const db = SQLite.openDatabase({ name: 'inventa.db', location: 'default' });

// Function to create tables if they do not exist
const createTablesIfNeeded = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        address TEXT
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        order_date TEXT,
        total_amount REAL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );`
    );
  });
};

// Initialize database and create tables if necessary
const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql('PRAGMA foreign_keys = ON;'); // Optional: Enable foreign key constraints
    createTablesIfNeeded(); // Ensure the tables are created
  });
};

// Call the initialization function to set up the database
initializeDatabase();

export { db };