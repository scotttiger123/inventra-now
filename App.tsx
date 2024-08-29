import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated,ScrollView,Image,Dimensions} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import CustomTabBar from './components/CustomeBottomBar/CustomTabBar';
import CustomerLedger from './components/reports/CustomerLedger';
import CreateInvoice from './components/invoice/CreateInvoice';
import AddCustomerScreen from './components/customer/addCustomerScreen';
import ListCustomers from './components/customer/listCustomers';
import AddItem from './components/invoice/AddItemScreen';
// import DownloadBackupScreen from './components/database/BackUp';
import CustomerDetail from './components/customer/customerDetail';
import EditCustomer from './components/customer/editCustomerScreen';

import LoginScreen from './components/login/loginScreen';
import RegisterScreen from './components/login/registerScreen';
import FetchInvoices from './components/invoice/fetchInvoices';
import InvoiceDetails from './components/invoice/invoiceDetails';


const Stack = createStackNavigator();
const themeColor = '#000';

const CustomTransition = ({ current }) => {

  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Slide from right to left
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX }],
      }}
    />
  );
};

function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator
          screenOptions={{
            cardStyleInterpolator: CustomTransition,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateInvoice"
            component={CreateInvoice}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Create Invoice',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="CustomerLedger"
            component={CustomerLedger}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Customer Ledger',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="AddItemScreen"
            component={AddItem}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Add Item',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="AddCustomerScreen"
            component={AddCustomerScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Add New Customer',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          {/* <Stack.Screen
            name="DownloadBackupScreen"
            component={DownloadBackupScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'DownloadBackupScreen',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          /> */}
          <Stack.Screen
            name="ListCustomers"
            component={ListCustomers}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Customers ',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="CustomerDetail"
            component={CustomerDetail}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Customer Detail ',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="EditCustomer"
            component={EditCustomer}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Edit Customer',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Login here',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Register ',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="FetchInvoices"
            component={FetchInvoices}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Invoices',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
          <Stack.Screen
            name="InvoiceDetails"
            component={InvoiceDetails}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                  <Icon name="arrow-back" size={24} color={themeColor} />
                </TouchableOpacity>
              ),
              headerTitle: 'Invoices Detail',
              headerTitleStyle: styles.headerTitle,
              headerStyle: styles.header,
            })}
          />
        
          
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  const screenWidth = Dimensions.get('window').width; // Get the screen width
  const imageWidth = screenWidth * 1; // 80% of the screen width
  const imageHeight = imageWidth * 1; // Adjust height to maintain aspect ratio

  const image1 = require('./components/images/1.jpg');
  const image2 = require('./components/images/1.jpg');
  const image3 = require('./components/images/1.jpg');

  return (
    <View style={styles.homeContainer}>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
        <AntDesign name="login" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.welcomeText}>Welcome to Inventra!</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageScroller}
      >
        <Image source={image1} style={[styles.image, { width: imageWidth, height: imageHeight }]} />
        <Image source={image2} style={[styles.image, { width: imageWidth, height: imageHeight }]} />
        <Image source={image3} style={[styles.image, { width: imageWidth, height: imageHeight }]} />
        {/* Add more images as needed */}
      </ScrollView>
      <CustomTabBar />
    </View>
  );
}



const styles = StyleSheet.create({
  loginButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007BFF',
    marginHorizontal: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerLeft: {
    marginLeft: 10,
  },
  headerTitle: {
    color: themeColor,
    fontWeight: 'bold',
    
  },
  header: {
    backgroundColor: '#fff',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  welcomeText: {
    paddingTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
  imageScroller: {
    alignItems: 'center',
  },
  image: {
    marginHorizontal: 10,
    resizeMode: 'cover', // Ensures the image scales correctly
  },
});

export default App;
