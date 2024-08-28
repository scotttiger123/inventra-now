import React, { useState, useRef, useEffect } from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveCustomer } from '../database/customers/saveCustomer'; // Adjust the path as needed


const AddCustomerScreen = ({ route }) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Create a ref for the name input
  const nameInputRef = useRef(null);

  useEffect(() => {
    // Focus on the name input field when the component mounts
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    saveCustomer(name, phone, address)
      .then(() => {
        Alert.alert('Success', 'Customer saved successfully');
        if (route.params?.onSave) {
          route.params.onSave({ name, phone, address });
        }
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Error', error);
        console.error('Error saving customer:', error);
      });
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            ref={nameInputRef} // Attach the ref to the TextInput
            style={styles.input}
            placeholder="Enter customer name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#aaa"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter customer phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter customer address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#aaa"
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
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AddCustomerScreen;
