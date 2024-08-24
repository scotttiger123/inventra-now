import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const DownloadBackupScreen = () => {
  const [backupPath, setBackupPath] = useState(null);

  const handleBackup = async () => {
    try {
      const filePath = await backupDatabase();
      if (filePath) {
        console.log(`Backup created at: ${filePath}`);
        setBackupPath(filePath);

        // Share the backup file via WhatsApp
        shareBackup(filePath);
      } else {
        Alert.alert('Error', 'Failed to create a backup.');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const backupDatabase = async () => {
    try {
      // Define file name and path
      const fileName = 'backup.sql';
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      // Simulate backup creation
      await RNFS.writeFile(filePath, 'Backup data');
      
      return filePath;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error; // Rethrow error to be caught by handleBackup
    }
  };

  const shareBackup = async (filePath) => {
    try {
      const shareOptions = {
        title: 'Share Backup',
        url: `file://${filePath}`,
        type: 'text/sql',
        social: Share.Social.WHATSAPP,
        message: 'Please find the backup of the database attached.',
      };
      await Share.shareSingle(shareOptions);
    } catch (error) {
      Alert.alert('Error', `Failed to share the backup: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Backup Database" onPress={handleBackup} />
      {backupPath && (
        <Text style={styles.infoText}>Backup created at: {backupPath}</Text>
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
