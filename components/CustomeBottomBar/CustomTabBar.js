import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, SafeAreaView, Dimensions,ScrollView,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import bannerImage from '../images/banner.png'; // Update the path accordingly
  
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function CustomTabBar() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('Home'); // Default to Home
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.8, 0],
  });

  useEffect(() => {
    // Set active tab based on the current route
    const routeName = route.name;
    switch (routeName) {
      case 'Home':
        setActiveTab('Home');
        break;
      case 'CustomerLedger':
        setActiveTab('CustomerLedger');
        break;
      case 'CreateInvoice':
        setActiveTab('CreateInvoice');
        break;
      case 'BankTransfer':
        setActiveTab('BankTransfer');
        break;
      case 'CNICTransfer':
        setActiveTab('CNICTransfer');
        break;
      case 'Settings':
        setActiveTab('Settings');
        break;
      case 'addPaymentScreen':
        setActiveTab('AddPaymentScreen');
        break;
      case 'ListPayments':
        setActiveTab('ListPayments');
        break;
      default:
        setActiveTab('Home'); // Fallback to Home if route name doesn't match
        break;
    }
  }, [route.name]); // Update active tab when route changes

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: animation } }],
    { useNativeDriver: false }
  );

  const handleStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationY > 100) {
        togglePopup();
      } else {
        Animated.timing(animation, {
          toValue: isPopupVisible ? 0 : 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
    Animated.timing(animation, {
      toValue: isPopupVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    switch (tabName) {
      case 'CustomerLedger':
        navigation.navigate('CustomerLedger');
        break;
      case 'CreateInvoice':
        navigation.navigate('CreateInvoice');
        break;
      case 'BankTransfer':
        navigation.navigate('BankTransfer');
        break;
      case 'ListCustomers':
        navigation.navigate('ListCustomers');
        break;
      case 'BackUp':
        navigation.navigate('DownloadBackupScreen'); // Ensure you navigate to Home screen
        break;
      case 'Settings':
        navigation.navigate('Settings'); // Ensure you navigate to Settings screen
        break;
        case 'addPaymentScreen':
        navigation.navigate('AddPaymentScreen'); // Ensure you navigate to Settings screen
        break;
        case 'ListPayments':
        navigation.navigate('ListPayments'); // Ensure you navigate to Settings screen
        break;
      case 'Invoices':
        navigation.navigate('FetchInvoices'); // Ensure you navigate to Chat screen
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Your main app content goes here */}
      </View>

      {isPopupVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={togglePopup}
        />
      )}


        
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View style={[styles.popupMenu, { transform: [{ translateY }] }]}>
          <TouchableOpacity style={styles.handle} onPress={togglePopup} />
          <ScrollView style={styles.scrollView}>

          <View style={styles.banner}>
             <Image source={bannerImage} style={styles.bannerImage} />
          </View>




          <View style={styles.header}>
            <Text style={styles.headerText}>Reports</Text>
          </View>
          <View style={styles.menuGrid}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress('BankTransfer')}>
              <View style={styles.iconBox}>
                <Icon name="account-balance" size={24} color={activeTab === 'BankTransfer' ? '#000' : '#03a65a'} />
              </View>
              <Text style={styles.menuText}>Bank Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress('CNICTransfer')}>
              <View style={styles.iconBox}>
                <Icon name="credit-card" size={24} color={activeTab === 'CNICTransfer' ? '#000' : '#03a65a'} />
              </View>
              <Text style={styles.menuText}>CNIC Transfer</Text>
            </TouchableOpacity>
            {/* Add more menu items as needed */}
          </View>



          <View style={styles.header}>
            <Text style={styles.headerText}>Sales  </Text>
          </View>
          <View style={styles.menuGrid}>
               <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress('CreateInvoice')}>
                     <View style={styles.iconBox}>
                       <Icon name="credit-card" size={24} color={activeTab === 'CreateInvoice' ? '#000' : '#03a65a'} />
                      </View>
                <Text style={styles.menuText}>Add Sale  </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress('addPaymentScreen')}>
                     <View style={styles.iconBox}>
                       <Icon name="credit-card" size={24} color={activeTab === 'addPaymentScreen' ? '#000' : '#03a65a'} />
                      </View>
                <Text style={styles.menuText}>Add Payment </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress('Invoices')}>
                     <View style={styles.iconBox}>
                       <Icon name="credit-card" size={24} color={activeTab === 'CreateInvoice' ? '#000' : '#03a65a'} />
                      </View>
                <Text style={styles.menuText}>Sale Report </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  togglePopup();
                  handleTabPress('CustomerLedger');
                }}
              >
              <View style={styles.iconBox}>
                <IconM name="dots-grid" size={24} color={activeTab === 'CustomerLedger' ? '#000' : '#03a65a'} />
              </View>
              <Text style={styles.menuText}>Customer Ledger</Text>
            </TouchableOpacity>


          </View>        

          <View style={styles.header}>
            <Text style={styles.headerText}>Payments </Text>
          </View>

              <View style={styles.menuGrid}>
                  
              <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress('ListPayments')}>
                <View style={styles.iconBox}>
                  <Icon name="credit-card" size={24} color={activeTab === 'ListPayments' ? '#000' : '#03a65a'} />
                </View>
                <Text style={styles.menuText}>Payment Report </Text>
              </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    togglePopup();
                    handleTabPress('ListCustomers');
                  }}
                >
                  <View style={styles.iconBox}>
                    <IconM name="dots-grid" size={24} color={activeTab === 'BackUp' ? '#000' : '#03a65a'} />
                  </View>
                  <Text style={styles.menuText}>Payment out </Text>
                </TouchableOpacity>
                
              </View>    


          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
          </View>

              <View style={styles.menuGrid}>
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    togglePopup();
                    handleTabPress('BackUp');
                  }}
                >
                  <View style={styles.iconBox}>
                    <IconM name="dots-grid" size={24} color={activeTab === 'BackUp' ? '#000' : '#03a65a'} />
                  </View>
                  <Text style={styles.menuText}>Backup Data</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    togglePopup();
                    handleTabPress('ListCustomers');
                  }}
                >
                  <View style={styles.iconBox}>
                    <IconM name="dots-grid" size={24} color={activeTab === 'BackUp' ? '#000' : '#03a65a'} />
                  </View>
                  <Text style={styles.menuText}>Customers</Text>
                </TouchableOpacity>
                
              </View>
              </ScrollView>
        </Animated.View>
      </PanGestureHandler>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('Home')}>
          <Icon name="home" size={24} color={activeTab === 'Home' ? '#000' : '#d3d3d3'} />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('CreateInvoice')}>
          <Icon6 name="file-invoice-dollar" size={24} color={activeTab === 'CreateInvoice' ? '#000' : '#d3d3d3'} />
          <Text style={styles.tabText}>Sale</Text>
        </TouchableOpacity>
        <View style={styles.plusButtonContainer}>
          <TouchableOpacity style={styles.plusButton} onPress={togglePopup}>
            <Icon name="add" size={36} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('Settings')}>
          <Icon name="settings" size={24} color={activeTab === 'Settings' ? '#000' : '#d3d3d3'} />
          <Text style={styles.tabText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('Invoices')}>
          <Icon name="chat" size={24} color={activeTab === 'Chat' ? '#000' : '#d3d3d3'} />
          <Text style={styles.tabText}>View </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 100, // Adjust the height as needed
    
    borderRadius:10,
    overflow: 'hidden',
    marginBottom:15
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Adjust if needed (cover, contain, etc.)
  },

  
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  plusButtonContainer: {
    position: 'relative',
    top: -30,
    marginLeft:20
  },
  plusButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,


  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    margin: -1000, // Adjust this value to increase the size of the overlay
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAFBFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    height: SCREEN_HEIGHT * 0.8,
    paddingTop: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    alignItems: 'left',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  menuItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    marginBottom: 5,
    borderWidth: 1, // Border width
    borderColor: '#E0E4F2', // Light color border
  },
  menuText: {
    fontSize: 12,
    color: '#333',
  },
});

export default CustomTabBar;
