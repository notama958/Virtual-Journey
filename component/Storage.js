import React, {useState, useEffect} from 'react';
import {Text, FlatList, SafeAreaView} from 'react-native';
import styles from '../css/styles';
// @ used modules
import RNFetchBlob from 'rn-fetch-blob';
// @ Child component and action
import {readFilesFromFolder, checkReadFilePermission} from '../api/actions';
import RenderFromStorage from './RenderFromStorage';
/**
 * Parent Component for Storage Screen
 * rendering flatlist array of images in local folder
 */
const Storage = ({navigation}) => {
  const [arrImage, setArrImage] = useState([]); // set state to current array image
  const [reload, setReload] = useState(false); // set state reload flatlist

  // immediately load files when open Storage
  useEffect(() => {
    (async function () {
      const readPermission = await checkReadFilePermission();
      if (readPermission) {
        const files = await readFilesFromFolder();
        setArrImage(files);
      } else alert('Please enable read/write permission');
    })();
  }, []);

  // play as a switcher for notifying reload Flatlist and arrImage
  useEffect(() => {
    if (reload) {
      (async function () {
        /**
         * call readFIlesFromFolder to get array of file names
         */
        const files = await readFilesFromFolder();
        setArrImage(files);
      })();
    }
    return function cleanup() {
      setReload(!reload);
    };
  }, [reload]);

  return (
    /**
     * Please refer to demo/Virtual_Journey.jpg
     */
    <SafeAreaView style={styles.flatlistContainer}>
      <FlatList
        data={arrImage}
        renderItem={({item}) => (
          <RenderFromStorage
            // act like RenderItem in ModalScreen
            // passing function setReload for onLongPress in child component ImageTag
            item={item}
            navigation={navigation}
            reload={setReload}
          />
        )}
        keyExtractor={(item, index) => index}
        numColumns={2}
        extraData={arrImage}
        ListFooterComponent={
          //counting photo in storage
          <Text style={styles.footerText}>{arrImage.length} photo(s)</Text>
        }
        extraData={arrImage}
      />
    </SafeAreaView>
  );
};

export default Storage;
