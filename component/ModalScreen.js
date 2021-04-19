import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, SafeAreaView} from 'react-native';
import styles from '../css/styles';
// import {getPhotoBySearch} from '../api/actions';
import RenderItem from './Render';

function ModalScreen({route, navigation}) {
  const {
    params: {location, tags, imageArr},
  } = route; //receive array of image info list
  // const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // console.log(location);
    console.log(tags);
    navigation.setOptions({title: tags});
    // console.log(imageArr);
  }, []);
  return (
    <SafeAreaView style={styles.flatlistContainer}>
      <FlatList
        data={imageArr}
        renderItem={({item, selectedId}) => (
          <RenderItem
            item={item}
            selectedId={selectedId}
            navigation={navigation}
          />
        )}
        keyExtractor={item => item.id}
        // extraData={selectedId}
        numColumns={3}
      />
    </SafeAreaView>
  );
}
export default ModalScreen;
