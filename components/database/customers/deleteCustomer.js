import { db } from '../DataBase.js'; // Import the database instance

const deleteCustomer = (customerId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM customers WHERE id = ?;',
        [customerId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            resolve('Customer deleted successfully');
          } else {
            reject('Failed to delete customer');
          }
        },
        error => {
          reject('Error deleting customer: ' + error.message);
        }
      );
    });
  });
};

export { deleteCustomer };
