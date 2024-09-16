import { db } from '../DataBase.js'; // Import your database instance
import { Alert } from 'react-native'; // Import Alert for displaying messages
import config from '../../config/config'; // Adjusted path to import config
import AsyncStorage from '@react-native-async-storage/async-storage';
import {syncUnsyncedInvoices} from '../syncData/syncInvoices.js'; // Adjusted path to import config
// Function to save invoice both locally and online
const saveInvoice = async (invoiceNo, date, customerName, customerId, items, discount,receive, total,remarks) => {

  const itemsJSON = JSON.stringify(items); // Convert items array to JSON string
  const invoiceData = {
    invoice_no: invoiceNo,
    date,
    customer_name: customerName,
    customer_id: customerId,
    items: itemsJSON,
    discount: parseFloat(discount) || 0,
    receive,
    remarks,
    total,
    
    
    
    
  };

  try {
    
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('need Login to save invoice');
    }
    invoiceData.user_id = userId;

    // Save locally
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO invoices (invoice_no, date, customer_name, customer_id, items, discount, receive, total,user_id,remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [invoiceNo, date, customerName, customerId, itemsJSON, parseFloat(discount) || 0, receive,  total, userId,remarks],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Invoice saved locally successfully');
              resolve('Invoice saved locally successfully');
            } else {
              console.log('Failed to save invoice locally');
              reject('Failed to save invoice locally');
            }
          },
          error => {
            console.error('Error saving invoice locally:', error.message);
            reject('Error saving invoice locally: ' + error.message);
          }
        );
      });
    });



    syncUnsyncedInvoices();
    

  } catch (error) {
    console.error('Error saving invoice:', error.message);
    Alert.alert('Error', 'Error saving invoice: ' + error.message);
  }
};

export { saveInvoice };

