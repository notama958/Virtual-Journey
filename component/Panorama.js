import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import PanoramaView from '@lightbase/react-native-panorama-view';
import styles from '../css/styles';
import {getVrPhotoUrl, getPhotoInfo, formatDate} from '../api/actions';

const Panorama = ({route, navigation}) => {
  const {
    params: {id, title},
  } = route;
  const [vrURL, setVrUrl] = useState('');
  const [info, setInfo] = useState({author: '', date: '', location: ''});
  // const {author, date} = info;
  useEffect(() => {
    (async function () {
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
      const res = await getPhotoInfo(id);
      const jsonString = res.slice(14, res.length - 1); // extract the jsonString
      let jsonFlickrApi = JSON.parse(jsonString);
      // console.log(jsonFlickrApi);
      const {
        photo: {
          dateuploaded,
          owner: {realname, username, location},
        },
        stat,
      } = jsonFlickrApi;
      if (stat === 'ok') {
        const date = new Date(dateuploaded * 1000);
        let author = realname ? realname : username;
        setInfo({date: formatDate(date), author: author, location: location});
        // info.date = date;
        // info.author = author;
        // info.location = location;
        // console.log(info);
      }
    })();
  }, []);
  return (
    <View style={styles.wrapper}>
      <View style={styles.wrapperInfoBox}>
        <View style={styles.infoBox}>
          <Text style={styles.textInfo}>
            Author: <Text style={styles.subTextInfo}>{info.author}</Text>
          </Text>
          <Text style={styles.textInfo}>
            Title: <Text style={styles.subTextInfo}>{title}</Text>
          </Text>
          <Text style={styles.textInfo}>
            Date: <Text style={styles.subTextInfo}>{info.date}</Text>
          </Text>
          <Text style={styles.textInfo}>
            Place:{' '}
            {info.location ? (
              <Text style={styles.subTextInfo}>{info.location}</Text>
            ) : (
              'unknown'
            )}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.downloadBtn}
          delayLongPress={6}
          onLongPress={() => {
            alert('saved');
            Vibration.vibrate(1 * 500, false);
          }}>
          <Text style={styles.textInfo} style={{textTransform: 'uppercase'}}>
            saved
          </Text>
        </TouchableOpacity>
      </View>

      <PanoramaView
        style={styles.viewer}
        dimensions={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}
        inputType="mono"
        enableTouchTracking={true}
        imageUrl={vrURL}
        onImageLoadingFailed={() => alert('loading~')}
        onImageDownloaded={() => alert('sucessful')}
      />
    </View>
  );
};

export default Panorama;
