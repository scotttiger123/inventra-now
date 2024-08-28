import { db } from '../DataBase.js'; // Import the database instance

const saveCustomer = (name, phone, address) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Step 1: Check if the phone number already exists
      tx.executeSql(
        'SELECT COUNT(*) AS count FROM customers WHERE phone = ?;',
        [phone],
        (tx, results) => {
          const count = results.rows.item(0).count;

          if (count > 0) {
            // Phone number already exists
            reject('Phone number already exists.');
          } else {
            // Phone number is unique, proceed with insertion
            tx.executeSql(
              `INSERT INTO customers (name, phone, address) VALUES (?, ?, ?);`,
              [name, phone, address],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  resolve('Customer saved successfully');
                } else {
                  reject('Failed to save customer');
                }
              },
              error => {
                reject('Error saving customer: ' + error.message);
              }
            );
          }
        },
        error => {
          reject('Error checking phone number: ' + error.message);
        }
      );
    });
  });
};

export { saveCustomer };
