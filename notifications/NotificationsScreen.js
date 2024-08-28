

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from './NotificationContext'; // Import your hook
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Import useFocusEffect and useNavigation


const NotificationScreen = () => {
  const { clearNotifications } = useNotification();
  const navigation = useNavigation(); // Access navigation
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear notifications when the component mounts
    clearNotifications();
    
  }, []);

  const getUserIdFromStorage = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        console.log('UserId from storage:', storedUserId);
      } else {
        console.error('No userId found in storage');
      }
    } catch (error) {
      console.error('Error getting userId from storage:', error.message);
    }
  }, []);
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;  // Exit if no userId is set

    try {
      setIsLoading(true);  // Start loading

      // Make the API request
      const response = await fetch(`https://hirenow.site/api/notifications/${userId}`);
      console.log("Response:", response);  // Log the response object

      if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Fetched data:', data);  // Log the data

      if (data && data.notifications) {
        setNotifications(data.notifications);
      } else {
        console.error('Failed to fetch notifications:', data.message || 'No message available');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    } finally {
      setIsLoading(false);  // Stop loading
    }
  }, [userId]);

  useEffect(() => {
    getUserIdFromStorage();
  }, [getUserIdFromStorage]);

  // Use useFocusEffect to fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        
        fetchNotifications();
        clearNotifications();
      }
    }, [userId, fetchNotifications])
  );

  // Render each notification item
  const renderNotificationItem = ({ item }) => {
    const handlePress = () => {
      try {
        if (item.job_id) {
          
          navigation.navigate('ViewApplicationsScreen', {
            jobId: item.job_id,
            applicantId: item.applicant_id || null, // Pass applicantId if it exists, otherwise null
          });
          
        } else {
          console.warn('No job ID available for navigation');
        }
        
      } catch (error) {
        console.error('Error during navigation:', error.message);
      }
    };

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={handlePress}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.body}</Text>
        <Text style={styles.appliedDate}>
              {formatAppliedDate(item.created_at)}
        </Text>
        
      </TouchableOpacity>
    );
  };
  const formatAppliedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5b1b71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationScreen;
