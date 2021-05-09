// @dependencies
import axios from 'axios'; // HTTP client
import {PermissionsAndroid} from 'react-native'; // Permission to read + write
import {FLICK_KEY, GROUP} from './types'; // keys
import RNFetchBlob from 'rn-fetch-blob'; // File systems API
import * as Location from 'expo-location'; // Location access
import NetInfo from '@react-native-community/netinfo'; // Internet check
import {createThrow} from 'typescript';
const {config, fs} = RNFetchBlob;

// example of urls
// 'https://live.staticflickr.com/65535/48451277551_27c72ae348_f.jpg';
// "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=XXX&group_id=44671723@N00&format=json"

const url = 'https://api.flickr.com/services/rest';

//@ route      GET /
//@des         get photo's detail info including author, title, location, dateupload,..
//@access      public
export const getPhotoInfo = async id => {
  const response = await axios.get(url, {
    params: {
      method: 'flickr.photos.getInfo',
      api_key: FLICK_KEY,
      photo_id: id,
      format: 'json',
    },
  });
  return response.data;
};

//@ route      GET /
//@des         get photo's all sizes link
//@access      public
export const getVrPhotoUrl = async id => {
  const response = await axios.get(url, {
    params: {
      method: 'flickr.photos.getSizes',
      api_key: FLICK_KEY,
      photo_id: id,
      format: 'json',
    },
  });
  return response.data;
};

//@ route       GET /
//@des         get photo's by search like tag, location, page
//@access      public
export const getPhotoBySearch = async (
  tags,
  {latitude, longitude},
  page = 1,
) => {
  const response = await axios.get(url, {
    params: {
      method: 'flickr.photos.search',
      api_key: FLICK_KEY,
      group_id: GROUP, // only search within Equirectangular where most of the VR photos there
      tags: tags,
      format: 'json',
      per_page: 30,
      page: page,
      ...(latitude && longitude ? {lat: latitude, lon: longitude} : {}),
    },
  });
  return response.data;
};

//@ route      GET /
//@des         get photo's by search with random page
//@access      public
export const getRandomPhoto = async randomPage => {
  const response = await axios.get(url, {
    params: {
      method: 'flickr.photos.search',
      api_key: FLICK_KEY,
      group_id: GROUP,
      format: 'json',
      per_page: 30,
      page: randomPage,
      sort: 'interestingness-desc',
    },
  });
  return response.data;
};

//@des         function to ask/get current location
//@access      public
export const getPermissionLocation = async () => {
  let access = await Location.requestForegroundPermissionsAsync();
  try {
    let {
      coords: {longitude, latitude},
    } = await Location.getCurrentPositionAsync({
      longitude: '',
      latitude: '',
    });
    return {longitude, latitude};
  } catch (error) {
    throw false;
  }
};

//@des         function to check current location's status
//@access      public
export const locationServiceEnabledAsync = async () => {
  let status = await Location.hasServicesEnabledAsync();
  return status;
};

//@des         function to convert date to format DD-MM-YYYY
//@access      public
export const formatDate = date => {
  if (date instanceof Date && !isNaN(date)) {
    let month = date.getMonth() + 1,
      year = date.getFullYear(),
      day = date.getDate();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) day = '0' + day.toString();
    return day + '-' + month + '-' + year;
  } else return '';
};

//@des         function to ask to write permission
//@access      public
export const checkWritePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'App needs access to your storage to download Photos',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else return false;
  } catch (error) {
    console.warn(err);
  }
};

//@des         function to ask to write permission
//@access      public
export const checkReadFilePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'App needs access to your storage to load Photos',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else return false;
  } catch (error) {
    alert(error);
    console.warn(error);
  }
};

//@des         function to download photo by url to app's directory on phone
//@access      public
export const downloadImage = vrURL => {
  let date = new Date();
  // get extension file png/jpg
  let ext = getFileExtension(vrURL);
  ext = '.' + ext[0];
  // get server id
  let server = vrURL.split('/')[3];
  // get photo id and secret id
  let ids = vrURL.split('/')[4].split('_').splice(0, 2);
  return new Promise((resolve, reject) => {
    // ensure  location is created
    fs.mkdir('/storage/emulated/0/Download/VJ')
      .then(() => {
        console.log('Created');
      })
      .catch(err => {
        console.log('Existed');
      });
    let PictureDir = '/storage/emulated/0/Download/VJ';
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          // file format: /image_date_serverid_photoid_secret.jpg/png
          PictureDir +
          '/image_' +
          date.getTime() +
          '_' +
          server +
          '_' +
          ids[0] +
          '_' +
          ids[1] +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', vrURL)
      .then(res => {
        // Showing alert after successful download
        resolve(res);
      })
      .catch(err => reject(err));
  });
};

//@des         sub-function to get file extension from url
//@access      public
export const getFileExtension = url => {
  return /[.]/.exec(url) ? /[^.]+$/.exec(url) : undefined;
};

//@des         function to read all files from  app's directory on phone
//@access      public
export const readFilesFromFolder = async () => {
  const path = '/storage/emulated/0/Download/VJ';
  fs.mkdir(path)
    .then(() => {
      console.log('Created');
    })
    .catch(err => {
      console.log('Existed');
    });
  const files = await fs.ls(path); // array of file names
  return files;
};

//@des         function to delete photo with its name
//@access      public
export const deleteImageFromStorage = async item => {
  const path = '/storage/emulated/0/Download/VJ/';
  return new Promise((resolve, reject) => {
    fs.unlink(path + item)
      .then(() => resolve(true))
      .catch(err => {
        reject(false);
        console.log(err);
      });
  });
};

//@des         function to check internet active
//@access      public

export const checkInternetConnection = () => {
  try {
    let status;
    NetInfo.addEventListener(state => {
      status = state.isConnected;
    });
    return status;
  } catch (err) {
    console.log(err);
  }
};
