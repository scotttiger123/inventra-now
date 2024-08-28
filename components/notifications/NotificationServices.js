import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { navigate, isReady } from './NavigationService'; // Import the navigate function

export function NotificationServices() {
  // Handle notification when the app is in the background and is opened
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log("Notification caused app to open from background:", remoteMessage.notification);
    if (isReady() && remoteMessage.data?.jobId) {
      navigate('ViewApplicationsScreen', {
        jobId: remoteMessage.data.jobId,
      });
    }
  });

  // Handle notification when the app is launched from a quit state by tapping on the notification
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log("Notification caused app to open from quit state:", remoteMessage.notification);
      if (isReady() && remoteMessage.data?.jobId) {
        navigate('ViewApplicationsScreen', {
          jobId: remoteMessage.data.jobId,
        });
      }
    }
  });

  // Handle notification when the app is in the foreground
  messaging().onMessage(async remoteMessage => {
    console.log("A new FCM message arrived while the app is in the foreground:", remoteMessage.notification);

    Alert.alert(
      'New Job Application',
      remoteMessage.notification?.body || 'Notification',
      [
        { 
          text: 'View', 
          onPress: () => {
            try {
              if (isReady() && remoteMessage.data?.jobId) {
                navigate('ViewApplicationsScreen', {
                  jobId: remoteMessage.data.jobId,
                });
              } else {
                console.error("Navigation not ready or jobId missing");
              }
            } catch (error) {
              console.error("Navigation error:", error);
            }
          } 
        },
        { text: 'OK' }
      ],
      { cancelable: true }
    );
  });
}