import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Share from 'react-native-share'; // Import the Share component


const Wasooli = () => {
  const shareReport = async () => {
    try {
      const shareOptions = {
        title: 'Share Report',
        message: 'Here is the report you requested.',
        url: 'data:text/html;base64,' + btoa('<h1>Report Content</h1><p>Details of the report...</p>'), // Example HTML content, replace with actual report data
        social: Share.Social.WHATSAPP,
      };
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error('Error sharing the report: ', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerText}>James brothers</Text>
      </View>
      
      <View style={styles.balanceCard}>
        <Text style={styles.balanceAmount}>Rs. 4,998,812</Text>
        <Text style={styles.balanceLabel}>I have to give</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text>SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={shareReport}>
          <Text style={styles.whatsappButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text>Reports</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.transactionHeader}>
        <Text style={[styles.headerColumnText , { flex: 2 }]}>Date</Text>
        <Text style={[styles.headerColumnText, { flex: 1, textAlign: 'right' }]}>I gave</Text>
        <Text style={[styles.headerColumnText, { flex: 1, textAlign: 'right' }]}>I got</Text>
      </View>
      
      <ScrollView style={styles.transactionList}>
        <View style={styles.transactionRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.transactionDate}>10th Aug, 09:22 PM</Text>
            <Text style={styles.transactionBalance}>Bal. Rs. 4,998,812</Text>
          </View>
          <View style={styles.gaveColumn}>
            <Text style={styles.gaveAmount}>Rs. 888</Text>
          </View>
          <View style={styles.gotColumn}>
            <Text style={styles.gotAmount}></Text>
          </View>
        </View>
        <View style={styles.transactionRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.transactionDate}>10th Aug, 09:22 PM</Text>
            <Text style={styles.transactionBalance}>Bal. Rs. 4,999,700</Text>
          </View>
          <View style={styles.gaveColumn}>
            <Text style={styles.gaveAmount}></Text>
          </View>
          <View style={styles.gotColumn}>
            <Text style={styles.gotAmount}>Rs. 555</Text>
          </View>
        </View>
        <View style={styles.transactionRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.transactionDate}>10th Aug, 08:37 PM</Text>
            <Text style={styles.transactionBalance}>Bal. Rs. 4,999,145</Text>
          </View>
          <View style={styles.gaveColumn}>
            <Text style={styles.gaveAmount}>Rs. 855</Text>
          </View>
          <View style={styles.gotColumn}>
            <Text style={styles.gotAmount}></Text>
          </View>
        </View>
        <View style={styles.transactionRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.transactionDate}>10th Aug, 08:37 PM</Text>
            <Text style={styles.transactionBalance}>Bal. Rs. 5,000</Text>
          </View>
          <View style={styles.gaveColumn}>
            <Text style={styles.gaveAmount}></Text>
          </View>
          <View style={styles.gotColumn}>
            <Text style={styles.gotAmount}>Rs. 5,000</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[styles.bottomButton, styles.gaveButton]}>
          <Text style={styles.buttonText}>I GAVE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.gotButton]}>
          <Text style={styles.buttonText}>I GOT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerColumnText: {
    fontSize: 12,
    
  },
  balanceCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  balanceLabel: {
    color: '#4caf50',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    padding: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    
  },
  transactionList: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateColumn: {
    flex: 2,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  gaveColumn: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff8f8',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  gotColumn: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fff8',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  transactionDate: {
    fontSize: 14,
    color: '#333',
  },
  transactionBalance: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5', // Light gray background
    borderRadius: 5, // Rounded corners
    paddingHorizontal: 8, // Adjust horizontal padding
    paddingVertical: 4, // Adjust vertical padding
    overflow: 'hidden', // Ensures border radius is applied correctly
    maxWidth: '80%', // Set a maximum width to control the size
    alignSelf: 'flex-start', // Align to the start of the container
  },
  gaveAmount: {
    fontSize: 14,
    
    color: '#ff5252',
  },
  gotAmount: {
    fontSize: 14,
    
    color: '#4caf50',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8, // Reduced padding for the container
  },
  
  bottomButton: {
    flex: 1,
    padding: 8, // Reduced padding for each button
    alignItems: 'center',
    borderRadius: 5, // Added border radius for rounded corners
    backgroundColor: '#f0f0f0', // Optional: add a background color for visibility
  },
  
  gaveButton: {
    backgroundColor: '#ff5252',
    marginRight: 8,
  },
  gotButton: {
    backgroundColor: '#4caf50',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Wasooli;