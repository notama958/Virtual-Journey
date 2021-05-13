import React, {useState, useEffect, Component} from 'react';
import {View, Text, TextInput, Vibration} from 'react-native';
import styles from '../css/styles';
// @ used modules
import AwesomeAlert from 'react-native-awesome-alerts';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from '@react-native-community/netinfo';
// @ Child Components and actions
import AppButton from './Button';
import {
  getPhotoBySearch,
  getPermissionLocation,
  locationServiceEnabledAsync,
  getRandomPhoto,
  checkInternetConnection,
} from '../api/actions';

// @ Parent component HomeScreen
function HomeScreen({navigation}) {
  const [isSelected, setSelection] = useState(false); //location checkbox
  const [text, setText] = useState(''); // TextInput
  const [alertPress, toggleAlert] = useState(false); // location alert box state
  const [gpsPermission, setGPSPermission] = useState(false); //gps permission
  const [currLocation, setLocation] = useState({
    // location object state
    longitude: null,
    latitude: null,
  });
  const [loading, setLoading] = useState(false); // loading array photos state
  const [error, setError] = useState(false); // error state when fail to load photos

  /**
   * Checking status of gps by interval time
   */
  useEffect(() => {
    var gps = setInterval(
      () => locationServiceEnabledAsync().then(res => setGPSPermission(res)),
      1000,
    );
    return () => clearInterval(gps); // clear it when unmount state
  }, [locationServiceEnabledAsync]);

  /**
   * gps check box is pressed and location is open already => activate gps search
   */
  useEffect(() => {
    if (alertPress) {
      getPermissionLocation()
        .then(data => {
          setLocation(data);
        })
        .catch(err => {
          setSelection(false);
        });
    }
  }, [alertPress]);

  /**
   * Debug purposes
   */
  // useEffect(() => {
  //   console.log(currLocation);
  // }, [text, currLocation]);
  // useEffect(() => {
  //   isSelected ? console.log('Ticked') : console.log('Unticked');
  // }, [isSelected]);

  return (
    /**
     * Please refer to the demo/Virtual_Journey.jpg
     */
    <View style={styles.container}>
      <View // HEADER
        style={{
          alignItems: 'center',
          borderColor: '#EDE5A6',
          borderRadius: 10,
          borderWidth: 1,
          backgroundColor: '#FFBA08',
        }}>
        <Text style={styles.h1}>Virtual Journey </Text>
        <Text style={styles.h2}>powered by Flickr</Text>
      </View>
      <TextInput // Input Box
        style={styles.textInput}
        placeholder="eg. Japan, Ocean,..etc"
        onChangeText={text => setText(text)}
        defaultValue={text}
      />

      <View style={{flexDirection: 'row', padding: 10}}>
        <AppButton // Location button
          title="GPS search?"
          size="sm"
          backgroundColor={isSelected ? '#8E94F2' : '#DB2763'}
          onPress={() => {
            toggleAlert(!alertPress);
            setSelection(!isSelected && gpsPermission);
          }}
        />
        <Text // Checkbox Location
          style={{
            margin: 7,
            padding: 2,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'white',
          }}>
          {isSelected ? '✅' : '❌'}
        </Text>
      </View>
      <View style={{flexDirection: 'column', padding: 0}}>
        <View style={{flexDirection: 'row', padding: 20}}>
          <Text style={styles.text}>Can't decide?</Text>
          <AppButton // Random button to Modal Screen
            title="Random"
            size="sm"
            backgroundColor="#E86A92"
            onPress={() => {
              /**
               *
               * Check internet connection
               * vibrate 0.5s no repeat
               * set loading to true
               * calling action getRandomPhoto
               * parse the response data to get array of item
               * stat is ok => move to ModalScreen
               * stat is not ok => throw error alert box
               *
               */

              Vibration.vibrate(1 * 500, false);
              setLoading(true);
              (async function () {
                const isConnected = checkInternetConnection();
                if (!isConnected) {
                  setLoading(false);
                  alert('No Internet Connection');
                } else {
                  setLocation({
                    longitude: null,
                    latitude: null,
                  });
                  const randomPage = Math.round(Math.random() * 200) + 1;
                  const res = await getRandomPhoto(randomPage);
                  const jsonString = res.slice(14, res.length - 1); // extract the jsonString
                  let jsonFlickrApi = JSON.parse(jsonString);
                  const {photos, stat} = jsonFlickrApi;
                  if (stat !== 'ok') {
                    setLoading(false);
                    setTimeout(() => setError(true), 500);
                  } else {
                    const {photo, pages, page} = photos;
                    setLoading(false); // finished loading image array ready to move to Modal Screen
                    setText('');
                    navigation.navigate('Modal', {
                      tags: 'Random',
                      imageArr: photo,
                      pages: pages,
                      page: page,
                    });
                  }
                }
              })();
            }}
          />
        </View>
        <View
          style={{
            margin: 20,
          }}>
          <AppButton // Explore button to ModalScreen
            title="Explore"
            size="sm"
            backgroundColor="#2A9D8F"
            onPress={() => {
              /**
               *
               * vibrate 0.5s no repeat
               * set loading to true
               * calling action getPhotoBySearch
               * parse the response data to get array of item
               * stat is ok => move to ModalScreen
               * stat is not ok => throw error alert box
               *
               */
              Vibration.vibrate(1 * 500, false);
              setLoading(true);
              (async function () {
                const isConnected = checkInternetConnection();
                if (!isConnected) {
                  setLoading(false);
                  alert('No Internet Connection');
                } else {
                  const res = await getPhotoBySearch(text, currLocation);
                  const jsonString = res.slice(14, res.length - 1); // extract the jsonString
                  let jsonFlickrApi = JSON.parse(jsonString);
                  const {photos, stat} = jsonFlickrApi;
                  setLocation({
                    longitude: null,
                    latitude: null,
                  });
                  if (stat !== 'ok') {
                    setLoading(false);
                    setTimeout(() => setError(true), 500);
                  } else {
                    const {photo, pages, page} = photos;
                    setTimeout(() => setLoading(false), 500);
                    setText('');
                    navigation.navigate('Modal', {
                      location: currLocation,
                      tags: text,
                      imageArr: photo,
                      pages: pages,
                      page: page,
                    });
                  }
                }
              })();
            }}
          />
          <AppButton // Storage button to Storage Screen
            title="Storage"
            size="sm"
            backgroundColor="#8895B3"
            onPress={() => navigation.navigate('Storage')}
          />
          <AwesomeAlert // alert box for GPS add/remove GPS
            show={alertPress}
            showProgress={false}
            title="Status"
            message={isSelected ? 'Add GPS' : 'Remove GPS'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={true}
            showCancelButton={true}
            cancelText="Cancel"
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => toggleAlert(false)}
          />
        </View>

        <AwesomeAlert // alert box for loading
          show={loading}
          showProgress={true}
          title="I'm loading~"
          message=""
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
        />
        <AwesomeAlert // alert box for error in fetching array of images
          show={error}
          showProgress={true}
          title="Server broken"
          message="Sorry🥴, please get back later 🤯"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Exit"
          onCancelPressed={() => setError(false)}
        />
      </View>
    </View>
  );
}
export default HomeScreen;
