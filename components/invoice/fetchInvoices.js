import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TouchableHighlight,ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchInvoicesOnline,loadInvoicesDataFromStorage } from '../database/invoices/fetchInvoicesOnline';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InvoiceList = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading
      
      loadInvoicesDataFromStorage()
        .then(data => {
         
          const sortedInvoices = data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
          setInvoices(data);
          console.log(data);
        })
        .catch(error => console.error('Failed to load invoices:', error))
        .finally(() => setLoading(false)); // Stop loading when data is fetched
    }, [])
  );

  const handleAction = (action) => {
    switch(action) {
      case 'view':
        navigation.navigate('InvoiceDetail', { invoice: selectedInvoice });
        break;
      case 'edit':
        navigation.navigate('EditInvoice', { invoice: selectedInvoice });
        break;
      default:
        break;
    }
    setModalVisible(false);
  };

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.addInvoice}
        onPress={() => navigation.navigate('CreateInvoice')}
      >
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.buttonText}>ADD SALE</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

    {loading ? (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
    ) : (
      <>
   
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.invoiceNumberText}>#   {item.order_id_manual}</Text>
              <Text style={styles.dateText}>{item.order_date}</Text>
              <Text style={styles.customerNameText}>{item.client_name}</Text>
              <Text style={styles.amountText}>
                {item.total && !isNaN(item.total_amount) ? item.total_amount.toLocaleString(0) : 'N/A'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.moreOptionsButton}
              onPress={() => {
                setSelectedInvoice(item);
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
      </>
     )}

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
  textContainer: {
    flex: 1,
  },
  invoiceNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  customerNameText: {
    fontSize: 12,
    color: '#000',
  },
  amountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  moreOptionsButton: {
    padding: 5,
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
    backgroundColor: '#fff',
  },
  addInvoice: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
    flex: 1,
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
