import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { savePayment } from '../database/payments/savePayment'; // Adjust the path to your savePayment function
import { loadCustomerDataFromStorage } from '../database/customers/fetchCustomers';  // Adjust the path as necessary
import { useFocusEffect } from '@react-navigation/native';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const AddPaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [supplierId, setSupplierId] = useState('');

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [focusedInput, setFocusedInput] = useState('');

  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const nameInputRef = useRef(null);



  //DATE PATTERN 
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

  //END DATEPATERN

  // Handle selecting a customer
  const handleSelectCustomer = (customer) => {
    setCustomerName(customer.clientname);
    setCustomerId(customer.id);
    setFilteredCustomers([]);
  };

  // Handle customer search
  const handleCustomerSearch = (text) => {
    setCustomerName(text);
    if (text.length > 0) {
      const filteredData = customers.filter(customer =>
        customer.clientname.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCustomers(filteredData);

    } else {

      setFilteredCustomers([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const customers = await loadCustomerDataFromStorage();
          setCustomers(customers);
        } catch (error) {
          console.error('Failed to fetch customers:', error);
        }
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Save payment function
  const handleSave = () => {

    // if (!customerId || !amount || !paymentMethod) {
    //   Alert.alert('Error', 'Please fill in all required fields.');
    //   return;
    // }

    savePayment(customerId,supplierId, customerName, date, amount, paymentMethod, description)
      .then((res) => {
        Alert.alert('Success', 'Payment saved successfully');
        // Reset all form fields
        setCustomerId('');
        setSupplierId('');
        setCustomerName('');
        setAmount('');
        setPaymentMethod('cash'); // Set to default value or empty string if required
        setDescription('');
        
    
      })
      .catch(error => {
        Alert.alert('Error', error.message || 'Failed to save payment');
        console.error('Error saving payment:', error);
      });
  };

  const renderCustomerItem = ({ item }) => (

    <TouchableOpacity style={styles.customerItem} onPress={() => handleSelectCustomer(item)}>
      <View style={styles.circle}>
        <Text style={styles.circleText}>{item.clientname.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerText}>{`${item.clientname} - ${item.contact} - ${item.address}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
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
        <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      </View>
        <View style={styles.inputContainer }>
          <Text style={styles.label}>Customer</Text>
            
          <View style={styles.row}>
              <Icon name="search" size={20} color="#000" />
                <TextInput
                  ref={nameInputRef}
                  style={[styles.input, { borderBottomColor: focusedInput === 'customerName' ? '#000' : '#ddd' }]}
                  placeholder="Enter customer name"
                  value={customerName}
                  onChangeText={handleCustomerSearch}
                  onFocus={() => setFocusedInput('customerName')}
                  onBlur={() => setFocusedInput('')}
                  placeholderTextColor="#aaa"
                />
             </View>   
          
        </View>

        {filteredCustomers.length > 0 && (
          <View style={styles.customerListContainer}>
            <FlatList
              data={filteredCustomers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCustomerItem}
              
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, { borderBottomColor: focusedInput === 'amount' ? '#000' : '#ddd' }]}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            onFocus={() => setFocusedInput('amount')}
            onBlur={() => setFocusedInput('')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { borderBottomColor: focusedInput === 'description' ? '#000' : '#ddd' }]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            onFocus={() => setFocusedInput('description')}
            onBlur={() => setFocusedInput('')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment Method</Text>
          <TextInput
            style={[styles.input, { borderBottomColor: focusedInput === 'paymentMethod' ? '#000' : '#ddd' }]}
            placeholder="Enter payment method (e.g. cash, card)"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            onFocus={() => setFocusedInput('paymentMethod')}
            onBlur={() => setFocusedInput('')}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <IconM name="content-save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
    marginLeft: 15,
  },
  inputFocused: {
    borderBottomColor: '#000', // Set a color for the focused input
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 70, // Space for the footer button
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    flex:1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
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
  
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
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


});


export default AddPaymentScreen;
