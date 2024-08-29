import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import config from '../config/config'; // Adjust the path to your config file



const RegisterScreen = ({ navigation }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (values, { setSubmitting }) => {
        setLoading(true); // Show the loader
        try {
            
                const response = await fetch(`${config.apiBaseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                }),
            });

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                Alert.alert('Registration Successful', result.success || 'Registration successful!');
                navigation.navigate('LoginScreen'); // Replace with your desired screen
            } else {
                // Extract and display detailed error message from API response
                let errorMessage = 'Registration Failed';
                if (result.error) {
                    // Flatten the error object for easier reading
                    errorMessage = Object.values(result.error)
                        .flat()
                        .join('\n');
                }
                Alert.alert('Registration Failed', errorMessage);
            }
        } catch (error) {
            // Log error for debugging
            console.error('Registration Error:', error);

            // Display a user-friendly error message
            Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
        } finally {
            setLoading(false); // Hide the loader
            setSubmitting(false); // Re-enable the submit button
        }
    };

    // Validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    return (
        <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
        >
            {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.container}>
                    

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                           style={{
                            borderBottomColor: '#ddd',
                            borderBottomWidth: 1, // This is necessary to show the border
                            padding: 10,
                            fontSize: 12,
                            
                            color: '#000',
                          }}
                            placeholder="Enter your email"
                            placeholderTextColor="#888"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            accessibilityLabel="Email Input"
                            accessibilityHint="Enter your email address"
                        />
                        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#888"
                                value={values.password}
                                onChangeText={handleChange('password')}
                                secureTextEntry={!passwordVisible}
                                accessibilityLabel="Password Input"
                                accessibilityHint="Enter your password"
                            />
                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!passwordVisible)}
                                style={styles.eyeIcon}
                            >
                                <Icon name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="#888" />
                            </TouchableOpacity>
                        </View>
                        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#888"
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                secureTextEntry={!confirmPasswordVisible}
                                accessibilityLabel="Confirm Password Input"
                                accessibilityHint="Confirm your password"
                            />
                            <TouchableOpacity
                                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                style={styles.eyeIcon}
                            >
                                <Icon name={confirmPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="#888" />
                            </TouchableOpacity>
                        </View>
                        {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isSubmitting && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                            <Text style={styles.loginLinkText}>Log in here</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Loading spinner */}
                    <Spinner
                        visible={loading}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
        position: 'relative',
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
        flex: 1,
        color: '#000',  // Ensure text color is visible
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: config.themeColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    buttonDisabled: {
        backgroundColor: '#888',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    loginContainer: {
        alignItems: 'center',
        padding: 10,
    },
    loginText: {
        color: '#888',
        fontSize: 14,
    },
    loginLinkText: {
        color: config.themeColor,
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#d9534f',
        fontSize: 12,
        marginTop: 5,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
});

export default RegisterScreen;
