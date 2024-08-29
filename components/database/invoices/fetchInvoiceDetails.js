// fetchInvoiceDetails.js
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'inventa.db', location: 'default' });

const fetchInvoiceDetails = (invoiceId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT invoices.*, 
                COALESCE(customers.name, invoices.customer_name) AS customer_name
         FROM invoices
         LEFT JOIN customers ON invoices.customer_id = customers.id
         WHERE invoices.id = ?`,
        [invoiceId],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            reject('Invoice not found');
          }
        },
        error => {
          console.error('Error fetching invoice details:', error);
          reject(error);
        }
      );
    });
  });
};

export { fetchInvoiceDetails };
