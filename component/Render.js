import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, SafeAreaView} from 'react-native';
import ImageTag from './ImageTag';
import styles from '../css/styles';

const RenderItem = ({item, selectedId, navigation}) => {
  const {id, owner, server, secret, title} = item;
  // const backgroundColor = id === selectedId ? '#6e3b6e' : '#f9c2ff';
  // const color = id === selectedId ? 'white' : 'black';
  const [url, setUrl] = useState(
    `https://live.staticflickr.com/${server}/${id}_${secret}_`,
  );

  return (
    <ImageTag
      item={item}
      onPress={() =>
        navigation.navigate('Panorama', {
          id: id,
          owner: owner,
          secret: secret,
          server: server,
          title: title,
        })
      }
      // backgroundColor={{backgroundColor}}
      // textColor={{color}}
      url={url + 'q.jpg'}
    />
  );
};

export default RenderItem;
