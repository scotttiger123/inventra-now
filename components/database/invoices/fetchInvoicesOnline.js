import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config'; // Adjusted path to import config


export const fetchInvoicesOnline = async () => {
  try {
    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    
    if (!userId) {
      throw new Error('User ID not found in AsyncStorage');
    }

    // Fetch invoice data from the API using axios
    //const response = await axios.get(`${config.apiBaseUrl}/invoice/user/${userId}`);

    const response = await axios.get(`${config.apiBaseUrl}/invoice/user/${userId}`);
    const invoicesData = response.data;

    // Store the invoice data in AsyncStorage
    await AsyncStorage.setItem('invoicesData', JSON.stringify(invoicesData));
    console.log('Invoice data stored successfully in AsyncStorage');

    return invoicesData;
  } catch (error) {
    console.error('Error fetching invoice data', error);
    throw error;
  }
};

// Function to load invoice data from AsyncStorage
export const loadInvoicesDataFromStorage = async () => {
  try {
    const storedData = await AsyncStorage.getItem('invoicesData');
    if (storedData !== null) {
      return JSON.parse(storedData);
    }
    return null; // Return null if no data is found
  } catch (error) {
    console.error('Error loading invoice data from AsyncStorage', error);
    throw error;
  }
};




// Function to calculate the total size of AsyncStorage data in MB
export const calculateAsyncStorageSize = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys(); // Retrieve all keys
    const totalData = await AsyncStorage.multiGet(allKeys); // Retrieve all key-value pairs

    let totalSize = 0;

    // Calculate size of each key-value pair
    totalData.forEach(([key, value]) => {
      const keySize = key ? new Blob([key]).size : 0;
      const valueSize = value ? new Blob([value]).size : 0;

      totalSize += keySize + valueSize; // Add sizes of keys and values
    });

    // Convert bytes to megabytes
    const totalSizeInMB = totalSize / 1048576; // 1 MB = 1,048,576 bytes

    console.log(`Total AsyncStorage size: ${totalSizeInMB.toFixed(2)} MB`);
    return totalSizeInMB;
  } catch (error) {
    console.error('Error calculating AsyncStorage size:', error);
  }
};




// Usage


