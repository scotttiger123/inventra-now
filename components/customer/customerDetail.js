import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { fetchCustomers } from '../database/customers/fetchCustomers';

const CustomerDetail = ({ route }) => {
  // Log route.params to see what is being passed
  console.log('Route params:', route.params);
  const { customer } = route.params || {};
  
  console.log('Received customer:', customer);

  const [cust, setCust] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Customer ID in useEffect:', customer);

    const fetchCustomerDetails = async () => {
      try {
        const customers = await fetchCustomers();
        console.log('Fetched customers:', customers);

        if (customer && customer.id) {
          const foundCustomer = customers.find(cust => cust.id === customer.id);
          setCust(foundCustomer);
        } else {
          console.error('Invalid customer:', customer);
        }
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customer]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!cust) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Customer not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Customer Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{cust.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{cust.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{cust.address}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 12,
    color: '#555',
  },
  errorText: {
    fontSize: 12,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CustomerDetail;
