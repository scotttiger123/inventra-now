import { db } from '../DataBase.js'; // Import your database instance
import { Alert } from 'react-native'; // Import Alert for displaying messages
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config'; // Adjusted path to import config
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo for network checking
import { loadCustomerDataFromStorage } from '..//customers/fetchCustomers';  // Adjust the import path as necessary
import { fetchPaymentsOnline, loadPaymentsDataFromStorage,fetchPaymentsLocal } from '..//payments/fetchPayments'; // Adjust to correct path

// Function to sync unsynced payments (sync = 0)
export const syncUnsyncedPayments = async () => {
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
          `SELECT * FROM payments WHERE sync = 0 OR sync IS NULL`, // Fetch unsynced payments
          [],
          async (tx, results) => {
            try {
              if (results.rows.length > 0) {
                // Iterate over all unsynced payments
                for (let i = 0; i < results.rows.length; i++) {
                  const unsyncedPayment = results.rows.item(i); // Get each unsynced payment
                  console.log('Unsynced payment found:', unsyncedPayment);

                  // Match customer name and find the ID
                  const customer = storedCustomerData.find(cust => cust.clientname.trim() === unsyncedPayment.party_name.trim());
                  if (customer) {
                    unsyncedPayment.customer_id = customer.id;
                  } else {
                    console.error('Customer not found for party_name:', unsyncedPayment.party_name);
                    // Handle case where customer is not found
                  }

                  // Prepare payment data for API call
                  const paymentData = {
                    date: unsyncedPayment.date,
                    customer_id: unsyncedPayment.customer_id,
                    supplier_id: unsyncedPayment.supplier_id,
                    amount: parseFloat(unsyncedPayment.amount),
                    payment_type: unsyncedPayment.payment_method,
                    description: unsyncedPayment.description,
                    user_id: userId,
                    party_name: unsyncedPayment.party_name,
                  };

                  // Try to save payment online via API
                  try {
                    const response = await fetch(`${config.apiBaseUrl}/payment/save`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(paymentData),
                    });

                    const result = await response.json();
                    console.log("Payment:", result.message);

                    if (response.ok) {
                      console.log('Payment saved online successfully');

                      // Mark payment as synced (sync = 1) locally
                      db.transaction(tx => {
                        tx.executeSql(
                          `UPDATE payments SET sync = 1 WHERE id = ?`, // Use primary key (e.g., `id`) to update
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
                      Alert.alert('Error', 'Failed to save payment online: ' + (result.error || 'Unknown error'));
                    }
                  } catch (error) {
                    console.error('Error saving payment online:', error.message);
                    Alert.alert('Error', 'Error saving payment online: ' + error.message);
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
