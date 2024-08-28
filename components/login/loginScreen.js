import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const themeColor = '#000';
const lightTextColor = '#888'; // Lighter color for the text

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // Show loader
    try {
      // Replace with your login logic
      const response = await fetch('https://lv.inventra.pk/api/loginApp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Login Successful', result.success || 'Login successful!');
        navigation.navigate('Home'); // Navigate to Home screen
      } else {
        let errorMessage = 'Login Failed';
        if (result.error) {
          errorMessage = Object.values(result.error)
            .flat()
            .join('\n');
        }
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.registerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.registerText}>
              <Text style={styles.lightText}>Don't have an account? </Text>
              <Text style={styles.registerLink}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color={themeColor} />
        ) : (
          <>
            
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Adjusted for the footer height
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    fontSize: 12,
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  lightText: {
    color: lightTextColor, // Lighter color for the text
  },
  registerLink: {
    color: themeColor, // Black color for "Register here"
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  saveButton: {
    backgroundColor: '#000',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LoginScreen;
