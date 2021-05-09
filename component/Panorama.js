import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Vibration,
  PermissionsAndroid,
} from 'react-native';
// @ Used module
import AwesomeAlert from 'react-native-awesome-alerts';
// @ Child Components and actions
import PanoramaView from '@lightbase/react-native-panorama-view';
import styles from '../css/styles';
import {
  getVrPhotoUrl,
  getPhotoInfo,
  formatDate,
  checkWritePermission,
  downloadImage,
  checkInternetConnection,
} from '../api/actions';

// @ Parent-component for rendering 360deg image
// prop passed to Panorama includes image info and photo id
const Panorama = ({route, navigation}) => {
  const [vrURL, setVrUrl] = useState(''); // set state for image url
  const [info, setInfo] = useState({author: '', date: '', location: ''}); // set state for picture info
  const [loading, setLoading] = useState(false); // set state loading alert box
  const [canDownload, setCanDownload] = useState(false); // ensure image is loaded before can actually download
  useEffect(() => {
    if (route.params.id !== undefined && route.params.title != undefined) {
      const {
        params: {id, title},
      } = route;
      (async function () {
        /**
         * Call getVrPhotoUrl with id provided
         * try to search for the highest quality dimension image (VR 4K)
         * some pictures don't have so we choose the last one (usually the biggest dimension)
         */
        const res = await getVrPhotoUrl(id);
        const jsonString = res.slice(14, res.length - 1); // extract the jsonString
        let jsonFlickrApi = JSON.parse(jsonString);
        const {
          sizes: {size},
          stat,
        } = jsonFlickrApi;
        if (stat === 'ok') {
          let vrImage = size.filter(image => image.label === 'VR 4K');
          if (vrImage.length === 0)
            vrImage = size.filter((image, index) => index === size.length - 1);
          setVrUrl(vrImage[0].source);
        }
      })();
      (async function () {
        /**
         * Call getPhotoInfo with id provided
         * try to search for image information
         * standard info: author, location, dateuploaded
         */
        const res = await getPhotoInfo(id);
        const jsonString = res.slice(14, res.length - 1); // extract the jsonString
        let jsonFlickrApi = JSON.parse(jsonString);
        const {
          photo: {
            dateuploaded,
            owner: {realname, username, location}, // some users dont display realname, so replace it with username
          },
          stat,
        } = jsonFlickrApi;
        if (stat === 'ok') {
          const date = new Date(dateuploaded * 1000);
          let author = realname ? realname : username;
          // set state for info
          setInfo({
            date: formatDate(date),
            author: author,
            location: location,
            title: title,
          });
        }
      })();
    } else {
      // set state for vrUrl
      setVrUrl(route.params.url);
    }
  }, []);

  return (
    /**
     * Please refer to the demo/Virtual_Journey.jpg
     */
    <View style={styles.wrapper}>
      {route.params.id !== undefined && route.params.title !== undefined ? (
        <View style={styles.wrapperInfoBox}>
          <View style={styles.infoBox}>
            <Text style={styles.textInfo}>
              Author: <Text style={styles.subTextInfo}>{info.author}</Text>
            </Text>
            <Text style={styles.textInfo}>
              Title: <Text style={styles.subTextInfo}>{info.title}</Text>
            </Text>
            <Text style={styles.textInfo}>
              Date: <Text style={styles.subTextInfo}>{info.date}</Text>
            </Text>
            <Text style={styles.textInfo}>
              Place:{' '}
              {
                // location might be missing
                info.location ? (
                  <Text style={styles.subTextInfo}>{info.location}</Text>
                ) : (
                  'unknown'
                )
              }
            </Text>
          </View>
          <TouchableOpacity
            style={styles.downloadBtn}
            delayLongPress={1000}
            onLongPress={() => {
              /**
               * if canDownload state is true
               * Call checkWritePermission
               * => reponse is true alert loading to notify user
               *    => call downloadImage => then set loading to false to turn off alert
               * => reponse is false => alert error
               *
               */
              Vibration.vibrate(1 * 500, false);
              if (canDownload) {
                const response = checkWritePermission();
                if (response) {
                  setLoading(true);
                  downloadImage(vrURL)
                    .then(res => {
                      setLoading(false);
                    })
                    .catch(err => {
                      setLoading(false);
                    });
                }
              }
            }}>
            <Text
              style={{
                textTransform: 'uppercase',
                fontSize: 13,
                color: '#F0F7F4',
                fontWeight: 'bold',
              }}>
              save
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.wrapperInfoBox}></View>
      )}

      <PanoramaView // main screen for rendering 360 image
        style={styles.viewer}
        dimensions={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}
        inputType="mono"
        enableTouchTracking={true}
        imageUrl={vrURL}
        onImageLoadingFailed={() => {
          // check internet connection to alert viewer
          const isConnected = checkInternetConnection();
          if (!isConnected) alert('No Internet Connection');
          else alert('May take few seconds to load');
        }}
        onImageDownloaded={() => {
          alert('Sucessful loaded');
          // some picture taking quite a long time to eventually downloaded
          // ensure the image is loaded before can calling save function
          setCanDownload(true);
        }}
      />

      <AwesomeAlert // alert box for saving
        show={loading}
        showProgress={true}
        title=""
        message="Saving 📥"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </View>
  );
};

export default Panorama;
