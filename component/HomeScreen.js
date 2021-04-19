import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Vibration} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import styles from '../css/styles';
import AppButton from './Button';
import {
  getPhotoBySearch,
  getPermissionLocation,
  locationServiceEnabledAsync,
  getRandomPhoto,
} from '../api/actions';
function HomeScreen({navigation}) {
  const [isSelected, setSelection] = useState(false); //GPS search
  const [text, setText] = useState('');
  const [alertPress, toggleAlert] = useState(false);
  const [gpsPermission, setGPSPermission] = useState(false);
  const [currLocation, setLocation] = useState({
    longitude: null,
    latitude: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInterval(
      () => locationServiceEnabledAsync().then(res => setGPSPermission(res)),
      1000,
    );
  }, [locationServiceEnabledAsync]);
  useEffect(() => {
    if (alertPress) {
      getPermissionLocation()
        .then(data => {
          // console.log(data);
          setLocation(data);
        })
        .catch(err => {
          setSelection(false);
        });
    }
  }, [alertPress]);

  useEffect(() => {
    console.log(currLocation);
    // console.log(text);
  }, [text, currLocation]);
  useEffect(() => {
    isSelected ? console.log('Ticked') : console.log('Unticked');
  }, [isSelected]);

  return (
    <View style={styles.container}>
      <View
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
      <TextInput
        style={styles.textInput}
        placeholder="eg. ocean, Vatican,..etc"
        onChangeText={text => setText(text)}
        defaultValue={text}
      />
      <View style={{flexDirection: 'row', padding: 10}}>
        <AppButton
          title="GPS search?"
          size="sm"
          backgroundColor={isSelected ? '#8E94F2' : '#DB2763'}
          onPress={() => {
            toggleAlert(!alertPress);
            setSelection(!isSelected && gpsPermission);
          }}
        />

        <Text
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
          <AppButton
            title="Random"
            size="sm"
            backgroundColor="#E86A92"
            onPress={() => {
              Vibration.vibrate(1 * 500, false);
              setLoading(true);
              (async function () {
                const res = await getRandomPhoto();
                const jsonString = res.slice(14, res.length - 1); // extract the jsonString
                let jsonFlickrApi = JSON.parse(jsonString);
                const {photos, stat} = jsonFlickrApi;
                const {photo, page, total} = photos;
                if (stat !== 'ok') {
                  console.log('Something wrong');
                } else {
                  setLoading(false);
                  navigation.navigate('Modal', {
                    tags: 'Random',
                    imageArr: photo,
                  });
                }
              })();
            }}
          />
        </View>
        <View
          style={{
            margin: 10,
          }}>
          <AppButton
            title="disabled"
            size="sm"
            backgroundColor="#28587B"
            onPress={() => navigation.navigate('Modal')}
            disable={true}
          />
          <AwesomeAlert
            show={alertPress}
            showProgress={false}
            title="Status"
            message={isSelected ? 'Add GPS' : 'Disabled GPS'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={true}
            showCancelButton={true}
            cancelText="Cancel"
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => toggleAlert(false)}
          />
        </View>
        <AppButton
          title="Explore"
          size="sm"
          backgroundColor="#009688"
          onPress={() => {
            Vibration.vibrate(1 * 500, false);
            setLoading(true);
            (async function () {
              console.log(currLocation);
              const res = await getPhotoBySearch(text, currLocation);
              const jsonString = res.slice(14, res.length - 1); // extract the jsonString
              let jsonFlickrApi = JSON.parse(jsonString);
              const {photos, stat} = jsonFlickrApi;
              const {photo, page, total} = photos;
              if (stat !== 'ok') {
                console.log('Something wrong');
              } else {
                setLoading(false);
                navigation.navigate('Modal', {
                  location: currLocation,
                  tags: text,
                  imageArr: photo,
                });
              }
            })();
          }}
        />
        <AwesomeAlert
          show={loading}
          showProgress={true}
          title="I'm loading~"
          message=""
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
        />
      </View>
    </View>
  );
}
export default HomeScreen;
