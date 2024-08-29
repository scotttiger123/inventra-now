import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, TouchableHighlight } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchInvoices } from '../database/invoices/fetchInvoices'; // Adjust the import path as necessary
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share';

const InvoiceList = () => {
  const navigation = useNavigation();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchInvoices()
        .then(data => {
          setInvoices(data);
          setFilteredInvoices(data);
        })
        .catch(error => console.error('Failed to fetch invoices:', error));
    }, [])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filteredData = invoices.filter(invoice =>
        invoice.invoice_no.toLowerCase().includes(text.toLowerCase()) ||
        invoice.customer_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredInvoices(filteredData);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  const handleShare = () => {
    Share.open({
      title: 'Share Invoice List',
      message: 'Here is the invoice list I wanted to share.',
    })
      .then((res) => console.log('Share successful:', res))
      .catch((err) => console.error('Share failed:', err));
  };

  const handleAction = (action) => {
    switch(action) {
      case 'view':
        navigation.navigate('InvoiceDetails', { invoiceId: selectedInvoice.id });
        break;
      case 'edit':
        navigation.navigate('EditInvoice', { invoice: selectedInvoice });
        break;
      default:
        break;
    }
    setModalVisible(false);
  };

  const renderInvoiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSelectedInvoice(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>Invoice No: {item.invoice_no}</Text>
        <Text style={styles.phoneText}>
          Customer: {item.customer_name || `ID ${item.customer_id}`}
        </Text>
        <Text style={styles.phoneText}>Date: {item.date}</Text>
        <Text style={styles.phoneText}>Total: Rs. {item.total.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
      >
        <Icon name="share" size={20} color="#007BFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addCustomer}
        onPress={() => navigation.navigate('AddInvoice')}
      >
        <AntDesign name="plus" size={20} color="#fff" />
        <Text style={styles.buttonText}>ADD INVOICE</Text>
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
            placeholder="Search invoices..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      {filteredInvoices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No invoices found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredInvoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvoiceItem}
          style={styles.listContainer}
        />
      )}
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
            <Text style={styles.modalTitle}>Invoice Actions</Text>
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

export default InvoiceList;
