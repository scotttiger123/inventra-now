import { db } from '../DataBase.js'; // Import your database instance
import { Alert } from 'react-native'; // Import Alert for displaying messages

import AsyncStorage from '@react-native-async-storage/async-storage';
import {syncUnsyncedPayments} from '../syncData/syncPayments.js'; // Adjusted path to import config
import { fetchPaymentsOnline, loadPaymentsDataFromStorage,fetchPaymentsLocal } from './fetchPayments'; // Adjust to correct path

// Function to save payment both locally and online
const savePayment = async (customerId,supplierId,partyName, date, amount, paymentType, description) => {
  
  try {
   console.log("amount " , amount);
    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('Login is required to save payment');
    }
    // Save locally in SQLite
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO payments (date, customer_id, supplier_id, party_name, amount, payment_method, description, user_id, transaction_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [date, customerId, supplierId, partyName, parseFloat(amount) || 0, paymentType, description, userId,'in'],
          (tx, results) => {
            
            if (results.rowsAffected > 0) {
              console.log('Payment saved locally successfully');
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
