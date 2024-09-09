import { db } from '../DataBase.js'; // Import the database instance
import config from '../../config/config'; // Adjusted path to import config
import AsyncStorage from '@react-native-async-storage/async-storage'; // For fetching user ID

// Function to save customer both locally and online
const saveCustomer = (name, phone, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        reject('User ID not found in AsyncStorage');
        return;
      }

      db.transaction(tx => {
        // Step 1: Check if the phone number already exists
        tx.executeSql(
          'SELECT COUNT(*) AS count FROM customers WHERE phone = ?;',
          [phone],
          async (tx, results) => {
            const count = results.rows.item(0).count;

            if (count > 100) {
              // Phone number already exists
              reject('Phone number already exists.');
            } else {
              // Phone number is unique, proceed with insertion
              tx.executeSql(
                `INSERT INTO customers (name, phone, address, user_id) VALUES (?, ?, ?, ?);`,
                [name, phone, address, userId],
                async (tx, results) => {
                  if (results.rowsAffected > 0) {
                    // Customer saved locally successfully
                    console.log('Customer saved locally successfully');

                    // Prepare customer data for online save
                    const customerData = {
                      name,
                      phone,
                      address,
                      user_id: userId,
                    };

                    // Step 2: Save the customer online
                    try {
                      const response = await fetch(`${config.apiBaseUrl}/customer/save`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(customerData),
                      });

                      const result = await response.json();

                      if (response.ok) {
                        console.log('Customer saved online successfully');
                        resolve('Customer saved successfully');
                      } else {
                        console.error('Failed to save customer online:', result.error || 'Unknown error');
                        reject('Failed to save customer online: ' + (result.error || 'Unknown error'));
                      }
                    } catch (error) {
                      console.error('Error saving customer online:', error.message);
                      reject('Error saving customer online: ' + error.message);
                    }
                  } else {
                    reject('Failed to save customer locally');
                  }
                },
                error => {
                  reject('Error saving customer locally: ' + error.message);
                }
              );
            }
          },
          error => {
            reject('Error checking phone number: ' + error.message);
          }
        );
      });
    } catch (error) {
      reject('Error: ' + error.message);
    }
  });
};

export { saveCustomer };
