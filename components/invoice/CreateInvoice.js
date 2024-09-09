import React, { useState,useEffect,useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image,FlatList,  Dimensions ,Animated} from 'react-native';

import {  useNavigation, useRoute } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { fetchCustomers, fetchCustomerOnline, loadCustomerDataFromStorage } from '../database/customers/fetchCustomers';  // Adjust the import path as necessary
import { fetchProductData, loadProductDataFromStorage } from '../database/products/fetchProducts';  // Adjust the import path as necessary
import { fetchInvoicesOnline,loadInvoicesDataFromStorage, calculateAsyncStorageSize } from '../database/invoices/fetchInvoicesOnline';
import { saveInvoice } from '../database/invoices/saveInvoice'; // Adjust the import path as necessary
import { countInvoices } from '../database/invoices/countInvoices'; // Adjust the import path as necessary
import { useFocusEffect } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';

import DateTimePickerModal from "react-native-modal-datetime-picker";


const CreateInvoice = () => {
  
  const navigation = useNavigation();
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState('');
  const [receive, setReceive] = useState('');
  const [total, setTotal] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]); // State for filtered customers
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [focusedInput, setFocusedInput] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const route = useRoute();
  

  useFocusEffect(

    useCallback(() => {

      const fetchData = async () => {
        try {
          const customers = await fetchCustomerOnline(); 
          setCustomers(customers);
          fetchInvoicesOnline();
          calculateAsyncStorageSize();

           // Fetch product data
          const freshProducts = await fetchProductData();
          const cachedProducts = await loadProductDataFromStorage();
    
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
      // Call the fetch function
      fetchData();
  
      // Dependency array is empty, meaning it will run once when the screen is focused
    }, []) // Re-run if dependencies (like route.params?.customer) change
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {

    setDate(date.toISOString().split('T')[0]);
    setDatePickerVisibility(false);
    //console.warn("A date has been picked: ", date);
    hideDatePicker();
  };
  
  const addItemToList = (newItem) => {
    setItems([...items, { ...newItem, id: items.length + 1 }]);
    setTotal(total + newItem.quantity * newItem.price);
  };
  
  useEffect(() => {

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
    countInvoices()
      .then(newInvoiceId => {
        setInvoiceNo(newInvoiceId.toString());
      })
      .catch(error => {
        console.error('Error fetching invoice ID:', error);
      });
  }, []);
  
  
  const renderCustomerItem = ({ item }) => {
    const initial = item.clientname.charAt(0).toUpperCase(); // Get the first letter and make it uppercase
    
    return (
      <TouchableOpacity
        style={styles.customerItem}
        onPress={() => handleSelectCustomer(item)}
      >
        <View style={styles.circle}>
          <Text style={styles.circleText}>{initial}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerText}>{item.clientname} - {item.contact} - {item.address}</Text>
        </View>
      </TouchableOpacity>
    );
  };


  const handleSelectCustomer = (customer) => {

    setCustomerName(customer.clientname); // Set the selected customer name
    setSelectedCustomerId(customer.id);
    setFilteredCustomers([]); // Clear the filtered list after selection
    console.log('Selected Customer:', customer);
  };

  const handleCustomerSearch = (text) => {
    setCustomerName(text);
    if (text.length > 0) {
      // Filter customers based on search text
      const filteredData = customers.filter(customer =>
        customer.clientname.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCustomers(filteredData);
    } else {
      setFilteredCustomers([]); // Clear the filtered list when input is cleared
    }
  };

  const handleSave = () => {

    saveInvoice(invoiceNo, date, customerName,selectedCustomerId, items, discount, total)
      .then(message => {
         // auto load invoice id 
        countInvoices()
            .then(newInvoiceId => {
              setInvoiceNo(newInvoiceId.toString());
              fetchInvoicesOnline();
            })
            .catch(error => {
              console.error('Error fetching invoice ID:', error);
            });
          //  
        console.log(message);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSaveAndNew = () => {
    // Logic to save the invoice and clear fields for new invoice
    console.log('Invoice saved and new invoice started');
    setInvoiceNo('');
    setDate('');
    setCustomerName('');
    setSelectedCustomerId(null);
    setItems([]);
    setDiscount('');
    setTotal(0);
  };
  
  return (
    <View style={styles.container}>
      {/* Invoice Details Section */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.inputContainerHalf , focusedInput === 'invoiceNo' && styles.inputFocused ]}>
          <IconM name="file-find-outline" size={22} color="#888" style={styles.icon} />
          <TextInput
              style={[
                styles.input,
                
              ]}
            placeholder="Invoice No"
            value={invoiceNo}
            onChangeText = {setInvoiceNo}
            onFocus= {()  => setFocusedInput('invoiceNo')}
            onBlur={()   => setFocusedInput('')}
          />
        </View>
        <View style={[styles.inputContainer, styles.inputContainerHalf , focusedInput === 'date' && styles.inputFocused ]}>
          
            <TouchableOpacity onPress={() => showDatePicker(true)}>
            
              <Icon name="calendar" size={20} color="#888" style={styles.icon} />
            </TouchableOpacity>

          <TextInput
            style={[
              styles.input,
              focusedInput === 'date' && styles.inputFocused // Apply focused style conditionally
            ]}
            placeholder="Date"
            value={date}
            onChangeText={setDate}
            onFocus={() => setFocusedInput('date')}
            onBlur={() => setFocusedInput('')}
          />
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Customer Details Section */}
      <View style={styles.row}>
      
      <View style={[styles.inputContainer, styles.inputContainer , focusedInput === 'customerName' && styles.inputFocused ]}>
          
          <TouchableOpacity
            style={styles.addCustomerButton}
            onPress={() => navigation.navigate('AddCustomerScreen')}
          >
            <IconM name="account-plus-outline" size={24} color="#888" />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'customerName' && styles.inputFocused // Apply focused style conditionally
            ]}
            
            placeholder="Customer Name"
            value={customerName}
            onChangeText={handleCustomerSearch} // Updated to handle search
            onFocus={() => setFocusedInput('customerName')}
            onBlur={() => setFocusedInput('')}
          />
        </View>
      </View>
       {/* Display Filtered Customer List */}
      {filteredCustomers.length > 0 && (
        <View style={styles.customerListContainer}>
          <FlatList
            data={filteredCustomers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCustomerItem}
            style={styles.customerList}
          />
          
        </View>
      )}
      
      {/* Add Items Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddItemScreen', { addItemToList })}>
          <IconM name="plus-circle" size={72} color="#007bff" style={styles.addIcon} />
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>



  <View style={styles.itemContainer}>
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.itemsSection}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../images/empty_cart.png')} // Adjust the path to the image file if necessary
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No items added</Text>
        </View>
      ) : (
        <ScrollView style={styles.itemsList}>
          {items.sort((a, b) => b.id - a.id).map((item) => {
            const originalPrice = item.price;
            const discountValue = item.isPercentage && item.discount > 0
              ? (item.price * item.discount) / 100
              : item.discount > 0
              ? item.discount
              : 0;
            const discountedPrice = originalPrice - discountValue;

            return (
              <View key={item.id.toString()} style={styles.itemRow}>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetailText}>
                    {item.quantity} {item.uom} x{' '}
                    {discountValue > 0 ? (
                      <>
                        <Text style={styles.originalPrice}>
                          {originalPrice.toLocaleString()}
                        </Text>
                        <Text> x </Text>
                        <Text style={styles.discountedPrice}>
                          {discountedPrice.toLocaleString()}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.discountedPrice}>
                        {originalPrice.toLocaleString()}
                      </Text>
                    )}
                  </Text>
                  {discountValue > 0 && (
                    <Text style={styles.discountText}>
                      {item.isPercentage
                        ? `(${item.discount}% off)`
                        : `(-${discountValue.toLocaleString()} off)`}
                    </Text>
                  )}
                </View>
                <Text style={styles.itemTotalText}>
                  <Text style={styles.currencyText}>Rs. </Text>
                  <Text style={styles.amountText}>
                    {(item.quantity * discountedPrice).toLocaleString()}
                  </Text>
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  </ScrollView>


        {/* Remarks input field and image upload button */}
        <View style={styles.remarksContainer}>
          <TextInput
            style={styles.remarksInput}
            placeholder="Enter remarks here"
            multiline
          />
          <TouchableOpacity style={styles.uploadButton}>
            <Entypo name="attachment" size={20} color="#333" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          
          <Text style={styles.symbol}>Rs.</Text>
          <Text style={styles.summaryText}>{total.toLocaleString()}</Text>
        </View>
        <View >
          <DashedLine dashLength={5} dashThickness={0.9} dashGap={5}   />
        </View>
        
        <View style={styles.summaryRow}>
            <View style={[styles.inputNumberContainer ,focusedInput === 'Discount' && styles.inputFocused   ]}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <View style={styles.inputWrapper}>
              <Text style={styles.symbol}>Rs.</Text>
                <TextInput
                  style={[
                    styles.inputNumber,
                  ]}
                  onFocus= {()  => setFocusedInput('Discount')}
                  onBlur={()   => setFocusedInput('')}
                  placeholder="Discount"
                  value={discount}
                  keyboardType="numeric"
                  onChangeText={setDiscount}
               />
            </View>
            </View>
        </View>
        <View style={styles.summaryRow}>
        <View style={[styles.inputNumberContainer ,focusedInput === 'Receive' && styles.inputFocused   ]}>
          
            <Text style={styles.summaryLabel}>Receive </Text>
            <Text style={styles.symbol}>Rs.</Text>
            <TextInput
              style={[
                styles.inputReceive,
              ]}
              onFocus= {()  => setFocusedInput('Receive')}
              onBlur={()   => setFocusedInput('')}
              placeholder="Received"
              value={receive}
              keyboardType="numeric"
              onChangeText={setReceive}
            />
            </View>
        </View>
        <View >
          <DashedLine dashLength={5} dashThickness={0.9} dashGap={5}   />
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Balance Due</Text>
          <Text style={styles.symbol}>Rs.</Text>
          <Text style={styles.summaryText}>{(total - (parseFloat(discount) || 0)).toLocaleString()}</Text>
        </View>
      </View>

      {/* Save Buttons */}
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.saveAndPrintButton} onPress={handleSave}>
          <IconM name="share" size={24} color="#fff" style={styles.saveIcon} />
          <Text style={styles.saveButtonText}>Share</Text>
        </TouchableOpacity> */}
        
        <TouchableOpacity style={styles.saveAndNewButton} onPress={handleSaveAndNew}>
          {/* <IconM name="content-save-all" size={24} color="#fff" style={styles.saveIcon} /> */}
          <Text style={styles.saveButtonText}>Save & New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          {/* <IconM name="content-save" size={24} color="#fff" style={styles.saveIcon} /> */}
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomColor: 'green',
    
    borderRadius: 1
  },

  inputNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inputLabel: {
    flex: 1,
    textAlign: 'left',
  },
  symbol: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,        // Smaller font size
    color: '#555',       // Slightly lighter color
    marginRight: 5,      // Small gap between the symbol and input
  },
  inputNumber: {
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    
    padding: 2,
    marginLeft: 10,
    width: 100,
    textAlign: 'right',
  },
  inputReceive: {
    borderBottomWidth: 1,
    borderBottomColor: 'green',
    
    padding: 2,
    marginLeft: 10,
    width: 100,
    textAlign: 'right',
  },
  summarySection: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    
    borderRadius:10,
    backgroundColor: '#e7f9eb',
    padding:10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Ensure label takes only needed space
  },
  summaryText: {
    fontSize: 14,
    color: '#000',
    flex: 1, // Ensure text takes only needed space
    textAlign: 'right', // Align text to the right
    borderBottomColor: '#000', // Slightly darker, appealing border color
  },
  
  inputFocused: {
    borderBottomColor: '#000', // Set a color for the focused input
    
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
  // input: {
  //   flex: 1,
  //   padding: 10,
  //   fontSize: 14,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ddd',
  //   borderColor: 'red', // Debug border color
  //   borderWidth: 1, // Debug border width
  //   backgroundColor: 'transparent',
  // },
  addCustomerButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  originalPrice: {
    textDecorationLine: 'line-through', // Strikethrough for original price
    color: 'gray',
    fontSize: 12,
  },
  discountText: {
    color: 'red', // Highlight discount in red
    fontSize: 12,
  },
  discountedPrice: {
    color: 'green', // Highlight final price in green
    fontSize: 12,
  },
  itemTotalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#EAF1FF', // Light background color for the total amount section
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  currencyText: {
    fontSize: 12,
    fontWeight: 'normal', // Light weight for "Rs."
    color: '#9E9E9E', // Light color for currency text
  },
  
  amountText: {
    fontSize: 12,
    fontWeight: 'bold', // Bold weight for the amount
    color: '#000', // Color for the amount
  },
  
  container: {
    flexGrow: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginRight: 10,
  },
  inputContainerHalf: {
    flex: 1,
  },
  customerInputContainer: {
    flex: 2,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 12, // Consistent font size
  },
  
  icon: {
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: 'transparent', // No background color
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  addIcon: {
    marginRight: 10,
    fontSize: 30, // Increase the icon size
  },
  buttonText: {
    color: '#000',
    fontSize: 12, // Consistent font size
    marginLeft: 8,
  },
  itemContainer: {
    flex: 1,
    marginBottom: 20,
  },
  itemsSection: {
    flex: 1,
  },
  itemsList: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  emptyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:15,
    backgroundColor: '#F7F8FC', // Light background color for each item row
    borderBottomWidth: 1,
    borderBottomColor: '#E0E4F2', // Slightly darker, appealing border color
    borderRadius: 8,
    marginBottom: 10,
  },
  
  itemTextContainer: {
    flex: 3,
  },
  itemName: {
    
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Convert text to uppercase
    
  },
  itemDetailText: {
    fontSize: 12,
    paddingTop:5,
    color: '#666',
    textTransform: 'uppercase', // Added to make text uppercase
  },
  
  remarksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  remarksInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E4F2',
    borderRadius: 5,
    padding: 10,
    fontSize: 12, // Consistent font size
    
  },
  uploadButton: {
    marginLeft: 10,
  },
  uploadImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  
  
  buttonContainer: {
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal:2
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '48%', // Make each button take up half of the width with some margin
    marginHorizontal: '1%', // Space between buttons
  },
  saveAndPrintButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveAndNewButton: {
    backgroundColor: '#000',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '48%', // Make each button take up half of the width with some margin
    marginHorizontal: '1%', // Space between buttons
  },
  saveIcon: {
    marginRight: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14, // Consistent font size
  },
});

export default CreateInvoice;
