import { db } from '../DataBase.js'; // Import your database instance
import { Alert } from 'react-native'; // Import Alert for displaying messages
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config'; // Adjusted path to import config
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo for network checking
import { loadCustomerDataFromStorage } from '..//customers/fetchCustomers';  // Adjust the import path as necessary
import { fetchPaymentsOnline, loadPaymentsDataFromStorage,fetchPaymentsLocal } from '..//payments/fetchPayments'; // Adjust to correct path

// Function to sync unsynced payments (sync = 0)
export const syncUnsyncedInvoices = async () => {
  try {
    // Check for internet connection
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      console.log('No internet connection, cannot sync payments.');
      // Alert.alert('Network Error', 'No internet connection available. Payments will be synced when online.');
      return; // Exit if no internet connection
    }

    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('Login is required');
    }

    // Load customer data from storage
    const storedCustomerData = await loadCustomerDataFromStorage();

    // Fetch unsynced payments (sync = 0 or sync is NULL) from SQLite
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM invoices WHERE sync = 0 OR sync IS NULL`, // Fetch unsynced payments
          [],
          async (tx, results) => {
            try {
              if (results.rows.length > 0) {
                // Iterate over all unsynced payments
                for (let i = 0; i < results.rows.length; i++) {
                    
                  const unsyncedPayment = results.rows.item(i); // Get each unsynced payment
                  console.log('Unsynced payment found:', unsyncedPayment);

                  
                  // Prepare payment data for API call
                  const paymentData = {
                    date: unsyncedPayment.date,
                    invoice_no: unsyncedPayment.invoice_no,
                    customer_id: unsyncedPayment.customer_id,
                    discount: parseFloat(unsyncedPayment.discount),
                    items: unsyncedPayment.items,
                    receive: unsyncedPayment.receive,
                    user_id: userId,
                    remarks: unsyncedPayment.remarks,
                    total:unsyncedPayment.total,
                    
                  };


                  // Try to save payment online via API
                  try {
                    const response = await fetch(`${config.apiBaseUrl}/invoice/save`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(paymentData),
                    });

                    const result = await response.json();
                    console.log("Ivoice:", result.message);

                    if (response.ok) {
                      console.log('Invoice  saved online successfully');

                      // Mark payment as synced (sync = 1) locally
                      db.transaction(tx => {
                        tx.executeSql(

                          `UPDATE invoices SET sync = 1 WHERE id = ?`, // Use primary key (e.g., `id`) to update
                          [unsyncedPayment.id],
                          (tx, updateResults) => {
                            if (updateResults.rowsAffected > 0) {
                              console.log('Payment sync status updated to 1');
                            } else {
                              console.log('Failed to update payment sync status');
                            }
                          },
                          error => {
                            console.error('Error updating sync status:', error.message);
                          }
                        );
                      });

                    } else {
                      console.error('Failed to save payment online:', result.error || 'Unknown error');
                      //Alert.alert('Error', 'Failed to save payment online: ' + (result.error || 'Unknown error'));
                    }
                  } catch (error) {
                    console.error('Error saving payment online:', error.message);
                    //Alert.alert('Error', 'Error saving payment online: ' + error.message);
                  }
                }
                fetchPaymentsOnline();
                resolve(); // All unsynced payments processed

              } else {
                console.log('No unsynced payments found');
                resolve(); // No unsynced payments to process
              }
            } catch (error) {
              console.error('Error handling payment:', error.message);
              reject('Error handling payment: ' + error.message);
            }
          },
          error => {
            console.error('Error fetching unsynced payments:', error.message);
            reject('Error fetching unsynced payments: ' + error.message);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error syncing payments:', error.message);
    Alert.alert('Error', 'Error syncing payments: ' + error.message);
  }
};
