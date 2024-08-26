import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchCustomers } from '../database/customers/fetchCustomers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share'; // Import Share

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchCustomers()
        .then(data => {
          const sortedCustomers = data.sort((a, b) => a.name.localeCompare(b.name));
          setCustomers(sortedCustomers);
        })
        .catch(error => console.error('Failed to load customers:', error));
    }, [])
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle share
  const handleShare = () => {
    Share.open({
      title: 'Share Customer List',
      message: 'Here is the customer list I wanted to share.',
      // Customize your share options as needed
    })
      .then((res) => console.log('Share successful:', res))
      .catch((err) => console.error('Share failed:', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text>
            <Icon name="share" size={24} color="#007BFF" /> {/* Light color for the share button */}
            </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.phoneText}>{item.phone}</Text>
            </View>
            <View style={styles.bottomBorder} />
          </View>
        )}
        style={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between', // Space out children
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'transparent', // Remove border color
    borderWidth: 0, // Remove border width
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  shareButton: {
    padding: 10,
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    position: 'relative',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 12,
    color: '#888',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 60,
    right: 20,
  },
});

export default CustomerList;
