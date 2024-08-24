import { db } from '../DataBase.js'; // Import the database instance

const saveCustomer = (name, phone, address) => {
  return new Promise((resolve, reject) => {  // Return a promise
    db.transaction(tx => {
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
    });
  });
};

export { saveCustomer };
