// components/CustomButton.js

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import globalStyles from './globalStyles';

const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity style={globalStyles.button} onPress={onPress}>
    <Text style={globalStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default CustomButton;
