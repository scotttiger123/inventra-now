// NotificationContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import messaging from '@react-native-firebase/messaging';

// Create a Context for the notification
const NotificationContext = createContext();

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const [hasNotification, setHasNotification] = useState(false);
  

  useEffect(() => {
  
    // Foreground notification listener
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Data:', remoteMessage.data);

      // Update state to show badge
      setHasNotification(true);
    });

    // Background and quit state notification handling
    const unsubscribeBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      setHasNotification(true);
    });

    // Clean up FCM listeners on unmount
    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

   const clearNotifications = () => {
    console.log('Clearing notifications');
    setHasNotification(false);
  };

  return (
    
     <NotificationContext.Provider value={{ hasNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Create a custom hook to use the NotificationContext
export const useNotification = () => {
  return useContext(NotificationContext);
};
