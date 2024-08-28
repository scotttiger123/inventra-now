import { db } from '../DataBase.js'; // Import the database instance

const updateCustomer = (id, name, phone, address) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Step 1: Update the customer details
      tx.executeSql(
        `UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?;`,
        [name, phone, address, id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            resolve('Customer updated successfully');
          } else {
            reject('Failed to update customer');
          }
        },
        error => {
          reject('Error updating customer: ' + error.message);
        }
      );
    });
  });
};

export { updateCustomer };
