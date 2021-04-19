import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';
import * as React from 'react';
import styles from '../css/styles';
const AppButton = ({onPress, title, size, backgroundColor, disable}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    disabled={disable}
    style={[
      styles.appButtonContainer,
      size === 'sm' && {
        paddingHorizontal: 8,
        paddingVertical: 6,
        elevation: 6,
      },
      (backgroundColor = {backgroundColor}),
    ]}>
    <Text style={[styles.appButtonText, size === 'sm' && {fontSize: 14}]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default AppButton;
