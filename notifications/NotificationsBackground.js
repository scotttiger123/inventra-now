
import messaging from '@react-native-firebase/messaging';
import { navigate } from './NavigationService'; // Import your navigation service

// Background message handler
export function setUpBackgroundMessageHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    // Default screen and data handling
    const screen = remoteMessage.data?.screen || 'ViewApplicationsScreen'; // Default to 'ViewApplicationsScreen'
    const jobId = remoteMessage.data?.jobId;

    // Navigate to the default screen with jobId if available
    if (jobId) {
      navigate(screen, {
        jobId, // Pass data as needed
      });
    } else {
      console.error('Job ID not found in notification data.');
    }
  });
}
