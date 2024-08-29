// fetchInvoices.js
import SQLite from 'react-native-sqlite-storage';

// Open or create the database
const db = SQLite.openDatabase({ name: 'inventa.db', location: 'default' });

const fetchInvoices = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT invoices.*, 
          COALESCE(customers.name, invoices.customer_name) AS customer_name
          FROM invoices
          LEFT JOIN customers ON invoices.customer_id = customers.id
          ORDER BY invoices.date DESC`,

        [],
        (tx, results) => {
          let customers = [];
          for (let i = 0; i < results.rows.length; i++) {
            customers.push(results.rows.item(i));
          }
          resolve(customers);
        },
        error => {
          console.error('Error fetching customers:', error);
          reject(error);
        }
      );
    });
  });
};

export { fetchInvoices };
