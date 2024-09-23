import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';

import { fetchInvoicesOnline,loadInvoicesDataFromStorage, calculateAsyncStorageSize } from '../database/invoices/fetchInvoicesOnline';

const EditInvoice = ({ route, navigation }) => {
  const { invoice } = route.params; // Retrieve the selected invoice from params
  const [orderIdManual, setOrderIdManual] = useState(invoice.order_id_manual);
  const [orderDate, setOrderDate] = useState(invoice.order_date);
  const [clientName, setClientName] = useState(invoice.client_name);
  const [totalAmount, setTotalAmount] = useState(invoice.total_amount.toString());

  const handleSave = () => {
    // Input validation (you can expand this based on your requirements)
    if (!orderIdManual || !orderDate || !clientName || !totalAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedInvoice = {
      ...invoice,
      order_id_manual: orderIdManual,
      order_date: orderDate,
      client_name: clientName,
      total_amount: parseFloat(totalAmount),
    };

    // Update invoice data in storage (you should implement this function)
    updateInvoiceDataInStorage(updatedInvoice)
      .then(() => {
        Alert.alert('Success', 'Invoice updated successfully');
        navigation.goBack(); // Go back to the invoice list after saving
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to update invoice');
        console.error(error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Order ID Manual</Text>
      <TextInput
        style={styles.input}
        value={orderIdManual}
        onChangeText={setOrderIdManual}
        placeholder="Enter Order ID"
      />

      <Text style={styles.label}>Order Date</Text>
      <TextInput
        style={styles.input}
        value={orderDate}
        onChangeText={setOrderDate}
        placeholder="Enter Order Date (YYYY-MM-DD)"
      />

      <Text style={styles.label}>Client Name</Text>
      <TextInput
        style={styles.input}
        value={clientName}
        onChangeText={setClientName}
        placeholder="Enter Client Name"
      />

      <Text style={styles.label}>Total Amount</Text>
      <TextInput
        style={styles.input}
        value={totalAmount}
        onChangeText={setTotalAmount}
        placeholder="Enter Total Amount"
        keyboardType="numeric"
      />

      <Button title="Save Invoice" onPress={handleSave} />
    </ScrollView>
  );
};

export default EditInvoice;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
