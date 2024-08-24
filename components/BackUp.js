import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';

const DownloadBackupScreen = () => {
  const [backupUrl, setBackupUrl] = useState(null);

  const handleBackup = async () => {
    const backupPath = await backupDatabase();
    if (backupPath) {
      setBackupUrl(`file://${backupPath}`);
    } else {
      Alert.alert('Error', 'Failed to create a backup.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Backup Database" onPress={handleBackup} />
      {backupUrl && (
        <WebView
          source={{ uri: backupUrl }}
          style={{ flex: 1 }}
        />
      )}
      {backupUrl && (
        <Text style={styles.infoText}>Your backup is ready. Use the download button in the WebView.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default DownloadBackupScreen;
