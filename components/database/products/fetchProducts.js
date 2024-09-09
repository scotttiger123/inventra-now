import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to fetch product data for the specific user ID from the API and store it in AsyncStorage
export const fetchProductData = async () => {
  try {
    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    
    if (!userId) {
      throw new Error('User ID not found in AsyncStorage');
    }

    const apiEndpoint = `https://lv.inventra.pk/api/products/user/34`;

    const response = await axios.get(apiEndpoint);
    const productData = response.data;

    // Store the product data in AsyncStorage
    await AsyncStorage.setItem('productData', JSON.stringify(productData));
    console.log('Product data stored successfully in AsyncStorage');

    return productData;
  } catch (error) {
    console.error('Error fetching product data', error);
    throw error;
  }
};

// Function to load product data from AsyncStorage
export const loadProductDataFromStorage = async () => {
  try {
    const storedData = await AsyncStorage.getItem('productData');
    if (storedData !== null) {
      return JSON.parse(storedData);
    }
    return null; // Return null if no data is found
  } catch (error) {
    console.error('Error loading product data from AsyncStorage', error);
    throw error;
  }
};
