import React from 'react';
import { View, StyleSheet } from 'react-native';

const NotificationBadge = ({ hasNotification }) => {
  return (
    hasNotification ? (
      <View style={styles.badge} />
    ) : null
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5, // Adjust position as needed
    right: -5, // Adjust position as needed
    backgroundColor: 'red',
    borderRadius: 10, // Makes it a round shape
    width: 10, // Size of the badge
    height: 10, // Size of the badge
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, // Optional: add border to make it stand out
    borderColor: 'white', // Optional: border color
  },
});

export default NotificationBadge;
