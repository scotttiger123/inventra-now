// components/CustomInput.js

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

const CustomInput = (props) => (
  <TextInput style={globalStyles.input} {...props} />
);

export default CustomInput;
