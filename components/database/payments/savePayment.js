import { db } from '../DataBase.js'; // Import your database instance
import { Alert } from 'react-native'; // Import Alert for displaying messages

import AsyncStorage from '@react-native-async-storage/async-storage';
import {syncUnsyncedPayments} from '../syncData/syncPayments.js'; // Adjusted path to import config
import { fetchPaymentsOnline, loadPaymentsDataFromStorage,fetchPaymentsLocal } from './fetchPayments'; // Adjust to correct path



// Function to check if a voucher number already exists
const checkVoucherExists = (voucherNo) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT voucher_no FROM payments WHERE voucher_no = ?',
        [voucherNo],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(true); // Voucher exists
          } else {
            resolve(false); // Voucher does not exist
          }
        },
        (error) => {
          console.error('Error checking voucher number:', error.message);
          reject(error.message);
        }
      );
    });
  });
};



// Function to save payment both locally and online
const savePayment = async (voucherNo,customerId,supplierId,partyName, date, amount, paymentType, description) => {
  
  try {
   console.log("amount " , amount);
    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('Login is required to save payment');
    }



     // Check if voucher number already exists
     const voucherExists = await checkVoucherExists(voucherNo);
     if (voucherExists) {
       Alert.alert('Error', 'Voucher number already exists. Please use a different voucher number.');
       return; // Stop execution if the voucher already exists
     }



    // Save locally in SQLite
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO payments (voucher_no, date, customer_id, supplier_id, party_name, amount, payment_method, description, user_id, transaction_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [voucherNo, date, customerId, supplierId, partyName, parseFloat(amount) || 0, paymentType, description, userId,'in'],
          (tx, results) => {
            
            if (results.rowsAffected > 0) {
              console.log('Payment saved locally successfully');
              Alert.alert('success', 'Payment saved successfully.');
              resolve('Payment saved  successfully');
            } else {
              console.log('Failed to save payment locally');
              reject('Failed to save payment locally');
            }
          },
          error => {
            console.error('Error saving payment locally:', error.message);
            reject('Error saving payment locally: ' + error.message);
          }
        );
      });
    });
    
    syncUnsyncedPayments();
    

    


    

  } catch (error) {
    console.error('Error saving payment:', error.message);
    Alert.alert('Error', 'Error saving payment: ' + error.message);
  }
};

export { savePayment };
