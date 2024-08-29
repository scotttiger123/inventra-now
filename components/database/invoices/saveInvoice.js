import { db } from '../DataBase.js'; // Import your database instance
import { Alert } from 'react-native'; // Import Alert for displaying messages

const saveInvoice = (invoiceNo, date, custoemrName, customerId, items, discount, total) => {
  return new Promise((resolve, reject) => {
    const itemsJSON = JSON.stringify(items); // Convert items array to JSON string

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO invoices (invoice_no, date, customer_name, customer_id, items, discount, total) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [invoiceNo, date, custoemrName, customerId, itemsJSON, parseFloat(discount) || 0, total],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Invoice saved successfully');
            Alert.alert('Success', 'Invoice saved successfully');
            resolve('Invoice saved successfully');
          } else {
            console.log('Failed to save invoice');
            Alert.alert('Error', 'Failed to save invoice');
            reject('Failed to save invoice');
          }
        },
        error => {
          console.error('Error saving invoice:', error.message);
          Alert.alert('Error', 'Error saving invoice: ' + error.message);
          reject('Error saving invoice: ' + error.message);
        }
      );
    });
  });
};

export { saveInvoice };
