import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TransactionItem = ({ date, balance, gave, got }) => (
  <View style={styles.transactionItem}>
    <View style={styles.dateColumn}>
      <Text style={styles.dateText}>{date}</Text>
      <Text style={styles.transactionBalance}>Bal. Rs. {balance}</Text>
    </View>
    <View style={styles.amountColumn}>
      {gave ? <Text style={styles.gaveAmount}>Rs. {gave}</Text> : <Text>-</Text>}
    </View>
    <View style={styles.amountColumn}>
      {got ? <Text style={styles.gotAmount}>Rs. {got}</Text> : <Text>-</Text>}
    </View>
  </View>
);

const QarisReport = () => {
  const transactions = [
    { id: '1', date: '10th Aug, 07:29 PM', balance: '45,781,228', gave: '54,545,455' },
    { id: '2', date: '10th Aug, 07:28 PM', balance: '8,764,227', got: '9,568' },
    { id: '3', date: '10th Aug, 07:28 PM', balance: '8,754,659', gave: '856' },
    { id: '4', date: '10th Aug, 07:28 PM', balance: '8,755,515', got: '8,754,515' },
    { id: '5', date: '10th Aug, 01:59 PM', balance: '1,000', got: '500' },
    { id: '6', date: '10th Aug, 01:58 PM', balance: '500', got: '500' },
  ];

 const renderHeader = () => (
  <>
    <Text style={styles.title}>Qari's Report</Text>
    <View style={styles.filterContainer}>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity style={styles.dateButton}>
          <MaterialIcons name="calendar-today" size={20} color="#000" />
          <Text style={styles.dateButtonText}>Start Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton}>
          <MaterialIcons name="calendar-today" size={20} color="#000" />
          <Text style={styles.dateButtonText}>End Date</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.allButton}>
        <MaterialIcons name="list" size={20} color="#000" />
        <Text style={styles.allButtonText}>All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryText}>I have to get</Text>
      <Text style={styles.summaryAmount}>Rs. 45,781,228</Text>
    </View>
    <View style={styles.headerContainer}>
      <Text style={[styles.headerText, styles.dateColumn]}>Date</Text>
      <Text style={[styles.headerText, styles.amountColumn]}>I gave</Text>
      <Text style={[styles.headerText, styles.amountColumn]}>I got</Text>
    </View>
    <View style={styles.totalContainer}>
      <View style={styles.dateColumn} />
      <View style={styles.amountColumn}>
        <Text style={styles.totalTextGave}>Rs. 54,546,311</Text>
      </View>
      <View style={styles.amountColumn}>
        <Text style={styles.totalTextReceive}>Rs. 8,765,083</Text>
      </View>
    </View>
  </>
);


  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.downloadButton}>
        <MaterialIcons name="file-download" size={22} color="#fff" />
        <Text style={styles.buttonText}>DOWNLOAD</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.whatsappButton}>
        <FontAwesome name="whatsapp" size={22} color="#fff" />
        <Text style={styles.buttonText}>WHATSAPP</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {renderHeader()}
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionItem {...item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      {renderFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  transactionBalance: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    backgroundColor: '#FAFBFC', // Light gray background
    borderRadius: 5, // Rounded corners
    paddingHorizontal: 4, // Adjust horizontal padding
    paddingVertical: 2, // Adjust vertical padding
    overflow: 'hidden', // Ensures border radius is applied correctly
    maxWidth: '80%', // Set a maximum width to control the size
    alignSelf: 'flex-start', // Align to the start of the container
  },
  container: {
    flex: 1,
    backgroundColor: '#fff', // Ensure the background is white
  },
  header: {
    backgroundColor: '#fff', // Ensure the header background is white
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff', // Ensure the list background is white
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff', // Ensure title background is white
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FAFBFC', // Ensure filter background is white
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    margin: 16,
  },
  datePickerContainer: {
    backgroundColor: '#FAFBFC', // Ensure filter background is white
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FAFBFC', // Ensure filter background is white
  },
  dateButtonText: {
    marginLeft: 8,
    color: '#000',
  },
  allButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    padding: 10,
    backgroundColor: '#FAFBFC', // Ensure filter background is white
    marginLeft: 8,
  },
  allButtonText: {
    marginLeft: 8,
    color: '#000',
  },
  summaryContainer: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff', // Ensure summary background is white
  },
  summaryText: {
    fontSize: 16,
    color: '#000',
  },
  summaryAmount: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 1,
    marginLeft:8
    
  },
  headerText: {
    padding: 4,
    fontSize:12,
    color: '#757575',
  },
  totalContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff', // Ensure total container background is white
  },
  totalTextGave: {
    color: '#e53935',
  },
  totalTextReceive: {
    color: '#43a047',
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff', // Ensure transaction item background is white
  },
  dateColumn: {
    flex: 2,
  },
  amountColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceText: {
    fontSize: 12,
    color: '#757575',
  },
  gaveAmount: {
    color: '#e53935',
    fontSize: 12,
  },
  gotAmount: {
    color: '#43a047',
    fontSize: 12,
  },
  footerContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff', // Ensure footer background is white
  },
  downloadButton: {
    backgroundColor: '#000', // Black background for DOWNLOAD button
    padding: 8, // Reduced padding
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5, // Subtle border width
    borderColor: '#e0e0e0', // Subtle border color
  },
  shareButton: {
    backgroundColor: '#25D366', // WhatsApp's original color
    padding: 8, // Reduced padding
    borderRadius: 5,
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5, // Subtle border width
    borderColor: '#e0e0e0', // Subtle border color
  },
  whatsappButton: {
    backgroundColor: '#25D366', // WhatsApp's original color
    padding: 8,
    borderRadius: 5,
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
});

export default QarisReport;
