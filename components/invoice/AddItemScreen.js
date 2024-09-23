
import React, { useState,useEffect,useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchProductData, loadProductDataFromStorage } from '../database/products/fetchProducts';  // Adjust the import path as necessary
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddItemScreen = ({ navigation, route }) => {
  
  const { addItemToList = () => {} } = route.params || {};
 
  
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [isPercentage, setIsPercentage] = useState(true);
  const [uom, setUOM] = useState('');
  const [uomOptions] = useState(['kg', 'liters', 'pieces', 'packs']);
  const [filteredUOMOptions, setFilteredUOMOptions] = useState(uomOptions);
  const [uomVisible, setUOMVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered customers
  const [productName, setProductName] = useState('');
  const [isFocused, setIsFocused] = useState(false); // State to track if the input is focused
  const [focusedInput, setFocusedInput] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);



  // Load `isPercentage` from AsyncStorage when the component mounts
  useEffect(() => {
    const loadIsPercentageFromStorage = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('isPercentage');
        if (storedValue !== null) {
          setIsPercentage(JSON.parse(storedValue)); // Convert back to boolean
        }
      } catch (error) {
        console.error('Failed to load isPercentage:', error);
      }
    };

    loadIsPercentageFromStorage();
  }, []);

  useFocusEffect(
    useCallback(() => {

      const fetchData = async () => {
        try {
          const cachedProducts = await loadProductDataFromStorage();
          console.log(cachedProducts,"Cashed Products ");
          setProducts(cachedProducts);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
      fetchData();
    }, []) // Re-run if dependencies (like route.params?.customer) change
  );

// Save `isPercentage` to AsyncStorage whenever it changes
const handleIsPercentageChange = async (value) => {
  setIsPercentage(value);
  console.log(value);

  try {
    await AsyncStorage.setItem('isPercentage', JSON.stringify(value)); // Save as a string
  } catch (error) {
    console.error('Failed to save isPercentage:', error);
  }

};
  const renderProductItem = ({ item }) => {
    const initial = item.product_name.charAt(0).toUpperCase(); // Get the first letter and make it uppercase
    
    return (
      <TouchableOpacity
        style={styles.customerItem}
        onPress={() => handleSelectProduct(item)}
      >
        <View style={styles.circle}>
          <Text style={styles.circleText}>{initial}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerText}>{item.product_name} - {item.quantity} </Text>
        </View>
      </TouchableOpacity>
    );
  };


  const handleSelectProduct = (product) => {

    setProductName(product.product_name); // Set the selected customer name
    setSelectedProductId(product.id);
    setFilteredProducts([]); // Clear the filtered list after selection
    console.log('Selected Customer:', product);
  };

  const handleCProductSearch = (text) => {
    setProductName(text);
    if (text.length > 0) {
      // Filter customers based on search text
      const filteredData = products.filter(product =>
        product.product_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filteredData);
    } else {
      setFilteredProducts([]); // Clear the filtered list when input is cleared
    }
  };



  const handleSave = () => {
    //uom.trim() === ''
    if (
      productName.trim() === '' ||
      isNaN(quantity) ||
      isNaN(price) ||
      quantity <= 0 ||
      price <= 0 
      
    ) {
      Alert.alert('Invalid Input', 'Please enter valid product details');
      return;
    }

    let discountAmount = parseFloat(discount);
    if (isPercentage && discountAmount > 0) {
      discountAmount = (discountAmount / 100) * parseFloat(price);
    }

    addItemToList({
      
      isPercentage:isPercentage,
      discount:discount,
      system_product_id:selectedProductId,
      name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      discountAmount: discountAmount,
      uom,
    });
    
    navigation.goBack();
  };

  const handleSaveAndNew = () => {
    if (
      productName.trim() === '' ||
      isNaN(quantity) ||
      isNaN(price) ||
      quantity <= 0 ||
      price <= 0 ||
      uom.trim() === ''
    ) {
      Alert.alert('Invalid Input', 'Please enter valid product details and select a UOM.');
      return;
    }

    let discountAmount = parseFloat(discount);

      if (isPercentage && discountAmount > 0) {

          discountAmount = (discountAmount / 100) * parseFloat(price);
      }

    addItemToList({
      isPercentage:isPercentage,
      discount:discount,
      system_product_id:selectedProductId,
      name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      discount: discountAmount,
      uom,
    });

    setProductName('');
    setQuantity('');
    setPrice('');
    setDiscount('');
    setUOM('');
    setSearchText('');
    setFilteredUOMOptions(uomOptions);
  };

  const filterUOMOptions = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = uomOptions.filter(option =>
        option.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUOMOptions(filtered);
    } else {
      setFilteredUOMOptions(uomOptions);
    }
  };

  const renderUOMOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setUOM(item);
        setUOMVisible(false);
        setSearchText('');
      }}
      style={styles.uomOptionContainer}
    >
      <Text style={styles.uomOption}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
         style={[
          styles.input,
          focusedInput === 'p_name' && { borderBottomColor: '#000' }, // Change border color when focused
        ]}
        placeholder="Enter Product Name"
        value={productName}
        onChangeText={handleCProductSearch} // Updated to handle search
        onFocus={() => setFocusedInput('p_name')} 
        onBlur={() => setFocusedInput(null)}  // When input loses focus
      />
       {/* Display Filtered Customer List */}
       {filteredProducts.length > 0 && (
        <View style={styles.customerListContainer}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProductItem}
            style={styles.customerList}
          />
          
        </View>
      )}

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={[
          styles.input,
          focusedInput === 'q' && { borderBottomColor: '#000' }, // Change border color when focused
        ]}
        onFocus={() => setFocusedInput('q')} 
        onBlur={() => setFocusedInput(null)}  // When input loses focus
        placeholder="Enter Quantity"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={[
          styles.input,
          focusedInput === 'Price' &&  { borderBottomColor: '#000' }, // Change border color when focused
        ]}
        onFocus={() => setFocusedInput('Price')} 
        onBlur={() => setFocusedInput(null)}  // When input loses focus
        placeholder="Enter Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Unit of Measure (UOM)</Text>
      <TouchableOpacity
        style={[
          styles.input,
          focusedInput === 'UOM' &&  { borderBottomColor: '#000' }, // Change border color when focused
        ]}
        onFocus={() => setFocusedInput('UOM')} 
        onBlur={() => setFocusedInput(null)}  // When input loses focus
        onPress={() => setUOMVisible(!uomVisible)}
      >
        <Text style={styles.inputText}>{uom || 'Select UOM'}</Text>
      </TouchableOpacity>

      {uomVisible && (
        <View style={styles.uomDropdown}>
          <TextInput
            style={styles.uomSearchInput}
            placeholder="Search UOM"
            value={searchText}
            onChangeText={filterUOMOptions}
          />
          <FlatList
            data={filteredUOMOptions}
            renderItem={renderUOMOption}
            keyExtractor={(item) => item}
            style={styles.uomList}
          />
        </View>
      )}



      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Discount in {isPercentage ? 'Percentage' : 'Value'}:</Text>
        <View style={styles.switchContainer}>
        <Switch
          value={isPercentage}
          onValueChange={handleIsPercentageChange}
          trackColor={{ false: '#767577', true: '#808080' }} // Gray background when switched on
          thumbColor={isPercentage ? '#00FF00' : '#f4f3f4'} // Green thumb when switched on
        />
        </View>
      </View>
      <TextInput
         style={[
          styles.input,
          focusedInput === 'disc' && { borderBottomColor: '#000' }, 
        ]}
        onFocus={() => setFocusedInput('disc')} 
        onBlur={()  => setFocusedInput(null)}  // When input loses focus
        placeholder={isPercentage ? 'Enter Discount (%)' : 'Enter Discount Value'}
        value={discount}
        keyboardType="numeric"
        onChangeText={setDiscount}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="save" size={12} color="#fff" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveAndNewButton} onPress={handleSaveAndNew}>
          <Icon name="plus" size={12} color="#fff" />
          <Text style={styles.buttonText}>Save & New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputFocused: {
    borderBottomColor: '#888', // Set a color for the focused input
    borderBottomWidth: 2, // Set the width of the bottom border
  },
  customerListContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    maxHeight: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  customerItem: {
    flexDirection: 'row', // Align circle and text horizontally
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 20, // Make it a circle
    backgroundColor: '#f3f2f8', // Background color for the circle
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Space between the circle and text
  },
  circleText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerInfo: {
    flex: 1,
  },
  customerText: {
    fontSize: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  switchContainer: {
    transform: [{ scale: 0.8 }], // Adjust the scale factor as needed
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 12,
    
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    fontSize: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 12,
    color: '#333',
  },
  uomDropdown: {
    position: 'absolute',
    top: 160, // Adjust based on your layout
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  uomSearchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    fontSize: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  uomList: {
    maxHeight: 150,
  },
  uomOptionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  uomOption: {
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 10, // Adjust this value to position the footer slightly above the bottom of the screen
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  saveAndNewButton: {
    backgroundColor: '#25D366',
    padding: 8,
    borderRadius: 20,
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

export default AddItemScreen;
