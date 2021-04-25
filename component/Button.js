// @ modules used
import {TouchableOpacity, Text} from 'react-native';
import * as React from 'react';
import styles from '../css/styles';

// template Button for HomeScreen's buttons
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
      title === ('Explore' || 'Storage') && {
        //Explore and Storage buttons have extra margin
        margin: 20,
      },
    ]}>
    <Text style={[styles.appButtonText, size === 'sm' && {fontSize: 14}]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default AppButton;
