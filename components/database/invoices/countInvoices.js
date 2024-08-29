import SQLite from 'react-native-sqlite-storage';

// Open or create the database
const db = SQLite.openDatabase({ name: 'inventa.db', location: 'default' });

const countInvoices = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) AS count FROM invoices',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const count = results.rows.item(0).count;
            const newInvoiceId = count + 1; // Generate the next invoice ID
            resolve(newInvoiceId);
          } else {
            reject('Failed to retrieve invoice count');
          }
        },
        error => {
          console.error('Error fetching invoice count:', error);
          reject(error);
        }
      );
    });
  });
};

export { countInvoices };
