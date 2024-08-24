// fetchCustomers.js
import SQLite from 'react-native-sqlite-storage';

// Open or create the database
const db = SQLite.openDatabase({ name: 'inventa.db', location: 'default' });

const fetchCustomers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM customers',
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

export { fetchCustomers };
