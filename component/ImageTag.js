import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, ImageBackground, Vibration} from 'react-native';
import styles from '../css/styles';
// @ Child Components and actions
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  deleteImageFromStorage,
  readFilesFromFolder,
  checkReadFilePermission,
} from '../api/actions';

// @Sub-component for rendering Flatlist
// prop passed to ImageTag include the function (setReload)
// to refetch the files in STORAGE after deletion

const ImageTag = props => {
  // check if img is from storage
  const [fromStorage, setFromStorage] = useState(
    props.item.title !== undefined ? false : true,
  );
  // set state for deleting image
  const [imageDeletion, setImageDeletion] = useState(false);

  return (
    <TouchableOpacity
      onPress={props.onPress}
      delayLongPress={1000}
      onLongPress={() => {
        if (fromStorage) {
          // activate on-long-press for only images in storage
          Vibration.vibrate(1 * 500, false);
          setImageDeletion(true);
        }
      }}
      style={[!fromStorage ? styles.item : styles.itemFromStorage]}>
      {
        /**
         * Storage Screen has different rendering url than in ModalScreen
         */
        !fromStorage ? (
          <ImageBackground source={{uri: props.url}} style={styles.logo}>
            <Text style={[styles.title]}>{props.item.title}</Text>
          </ImageBackground>
        ) : (
          <ImageBackground
            source={{uri: props.url}}
            style={styles.logoFromStorage}></ImageBackground>
        )
      }
      <AwesomeAlert // alert user to accept/deny removal
        show={imageDeletion}
        showProgress={true}
        title="⚠️Warning⚠️"
        message="❌Are you sure (cannot undo)❌"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancel"
        cancelButtonColor="#DD6B55"
        onCancelPressed={() => setImageDeletion(false)}
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          /**
           *
           * set state for imageDeletion to false => close this alert rightaway
           * calling action deleteImageFromStorage with local url
           * wait for response (true/false)
           * call function setReload from Storage component
           * setReload state to false after 1s (re-rendering the number of files available in STORAGE)
           */
          (async function () {
            let res;

            try {
              res = await deleteImageFromStorage(props.item);
            } catch (err) {
              res = err;
            }
            props.setReload(res);
            setImageDeletion(false);
            setTimeout(() => {
              props.setReload(false);
            }, 1000);
          })();
        }}
      />
    </TouchableOpacity>
  );
};
export default ImageTag;
