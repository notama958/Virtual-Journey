import React, {useEffect} from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import styles from '../css/styles';
function ImageTag({item, onPress, url}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
      <ImageBackground source={{uri: url}} style={styles.logo}>
        <Text style={[styles.title]}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}
export default ImageTag;
