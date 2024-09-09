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
    // Create the invoices table if it doesn't exist
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_no TEXT,
        user_id INTEGER,
        date TEXT,
        customer_id INTEGER,
        customer_name TEXT,
        items TEXT,
        discount REAL,
        total REAL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );`
    );
  });

};
const addCustomerNameColumn = () => {
  db.transaction(tx => {
    tx.executeSql(
      'ALTER TABLE customers ADD COLUMN user_id INTEGER;',
      [],
      () => {
        console.log('Column customer_name added successfully');
      },
      (error) => {
        console.error('Error adding column:', error);
      }
    );
  });
};

// Initialize database and create tables if necessary
const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql('PRAGMA foreign_keys = ON;'); // Optional: Enable foreign key constraints
    createTablesIfNeeded(); // Ensure the tables are created
     addCustomerNameColumn();
  });
};

// Call the initialization function to set up the database
initializeDatabase();

export { db };