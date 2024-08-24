// components/CustomCard.js

import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from './globalStyles';

const CustomCard = ({ title, content }) => (
  <View style={globalStyles.card}>
    <Text style={[globalStyles.text, { fontWeight: 'bold', fontSize: 18 }]}>{title}</Text>
    <Text style={globalStyles.text}>{content}</Text>
  </View>
);

export default CustomCard;
