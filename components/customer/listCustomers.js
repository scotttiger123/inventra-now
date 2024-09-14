import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchCustomers,fetchCustomerOnline } from '../database/customers/fetchCustomers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


import Share from 'react-native-share'; // Import Share

const CustomerList = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchCustomerOnline()
        .then(data => {
          const sortedCustomers = data.sort((a, b) => a.name.localeCompare(b.name));
          setCustomers(sortedCustomers);
        })
        .catch(error => console.error('Failed to load customers:', error));
    }, [])
  );

  // Filter customers based on the search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
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
 
  // Function to handle actions
  const handleAction = (action) => {
    switch(action) {
      case 'view':
        navigation.navigate('CustomerDetail', { customer: selectedCustomer });
        break;
      case 'edit':
        navigation.navigate('EditCustomer', { customer: selectedCustomer });
        console.log('Edit', selectedCustomer);
        break;
      default:
        break;
    }
    setModalVisible(false);
  };

//



  const renderFooter = () => (
    <View style={styles.footerContainer}>
    
      <TouchableOpacity
        style={styles.addCustomer}
        onPress={() => navigation.navigate('AddCustomerScreen')}
      >
        <AntDesign name="plus" size={20} color="#fff" />
        <Text style={styles.buttonText}>ADD CUSTOMER</Text>
      </TouchableOpacity>
    </View>
  );

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
            <Icon name="share" size={20} color="#007BFF" /> 
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
            <TouchableOpacity
              style={styles.moreOptionsButton}
              onPress={() => {
                setSelectedCustomer(item);
                setModalVisible(true);
              }}
            >
              <Icon name="more-vert" size={20} color="#888" />
            </TouchableOpacity>
            <View style={styles.bottomBorder} />
          </View>
        )}
        style={styles.listContainer}
      />
      {renderFooter()}

      {/* Custom Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalTitle}>Customer Actions</Text>
            <TouchableHighlight style={styles.modalButton} onPress={() => handleAction('view')}>
              <Text style={styles.modalButtonText}>View Details</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.modalButton} onPress={() => handleAction('edit')}>
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
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
    marginLeft: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'transparent', // Remove border color
    borderWidth: 0, // Remove border width
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 12,
  },
  shareButton: {
    padding: 5,
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
  moreOptionsButton: {
    padding: 5,
  },
  moreOptionsIcon: {
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
  footerContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff', // Ensure footer background is white
  },
  addCustomer: {
    backgroundColor: '#000', // WhatsApp's original color
    padding: 8,
    borderRadius: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5, // Subtle border width
    borderColor: '#e0e0e0', // Subtle border color
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14, // Reduced font size
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 12,
    color: '#007BFF',
  },
});

export default CustomerList;
