// components/AccentText.js

import React from 'react';
import { Text } from 'react-native';
import globalStyles from './globalStyles';

const AccentText = ({ children, style }) => (
  <Text style={[globalStyles.accentText, style]}>{children}</Text>
);

export default AccentText;
