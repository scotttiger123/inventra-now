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
        receive REAL,
        total REAL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );`
    );
    tx.executeSql(

      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_type TEXT CHECK(transaction_type IN ('in', 'out')), -- 'in' for incoming, 'out' for outgoing
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        customer_id INTEGER,
        supplier_id INTEGER,
        party_name TEXT,
        reference TEXT,
        description TEXT,
        user_id INTEGER,
        sync INTEGER,
        payment_method TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );
  });

};
// Payments Table





const addCustomerNameColumn = () => {
  db.transaction(tx => {
    tx.executeSql(
      'ALTER TABLE payments DROP COLUMN party_name TEXT;',
      [],
      () => {
        console.log('Column party_name added successfully');
      },
      (error) => {
        console.error('Error adding column:', error);
      }
    );
  });
};

const deleteData = () => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM payments',
          [],
          () => {
            console.log('deleted successfully');
          },
          (error) => {
            console.error('Error adding column:', error);
          }
        );
      });
  } 
  const viewData = () => {

      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM payments',
          [],
          (tx, results) => {
            const rows = results.rows;
            let rowList = [];
            for (let i = 0; i < rows.length; i++) {
              rowList.push(rows.item(i));
            }
            console.log('All payments:', rowList);
          },
          error => {
            console.error('Error fetching payments:', error.message);
          }
        );
      });

  }
// Function to check the schema of the payments table
const checkTableSchema = () => {
  db.transaction(tx => {
    tx.executeSql(
      'PRAGMA table_info(payments);',
      [],
      (tx, results) => {
        const columns = [];
        for (let i = 0; i < results.rows.length; i++) {
          columns.push(results.rows.item(i));
        }
        
        // Convert the schema info to a prettified JSON string
        const schemaJson = JSON.stringify({ table: 'payments', columns }, null, 2);
        console.log('Payments table schema:', schemaJson);

      },
      (error) => {
        console.error('Error retrieving table schema:', error);
      }
    );
  });
};



// Initialize database and create tables if necessary
const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql('PRAGMA foreign_keys = ON;'); // Optional: Enable foreign key constraints
    createTablesIfNeeded(); // Ensure the tables are created
    //viewData();
      //deleteData();
     //addCustomerNameColumn();
     //checkTableSchema();
  });
};

// Call the initialization function to set up the database
initializeDatabase();


export { db };