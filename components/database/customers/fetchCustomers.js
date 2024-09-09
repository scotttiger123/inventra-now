// fetchCustomers.js
import SQLite from 'react-native-sqlite-storage';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Open or create the database
const db = SQLite.openDatabase({ name: 'inventa.db', location: 'default' });

const fetchCustomers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM customers',
        [],
        (tx, results) => {
          let customers = [];
          for (let i = 0; i < results.rows.length; i++) {
            customers.push(results.rows.item(i));
          }
          resolve(customers);
        },
        error => {
          console.error('Error fetching customers:', error);
          reject(error);
        }
      );
    });
  });
};



// Function to fetch product data for the specific user ID from the API and store it in AsyncStorage
export const fetchCustomerOnline = async () => {
  try {
    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    
    if (!userId) {
      throw new Error('User ID not found in AsyncStorage');
    }

    const apiEndpoint = `https://lv.inventra.pk/api/customer/user/${userId}`;

    const response = await axios.get(apiEndpoint);
    const productData = response.data;

    // Store the product data in AsyncStorage
    await AsyncStorage.setItem('custoemrtData', JSON.stringify(productData));
    console.log('Product data stored successfully in AsyncStorage');

    return productData;
  } catch (error) {
    console.error('Error fetching product data', error);
    throw error;
  }
};

// Function to load product data from AsyncStorage
export const loadCustomerDataFromStorage = async () => {
  try {
    const storedData = await AsyncStorage.getItem('customerData');
    if (storedData !== null) {
      return JSON.parse(storedData);
    }
    return null; // Return null if no data is found
  } catch (error) {
    console.error('Error loading product data from AsyncStorage', error);
    throw error;
  }
};
