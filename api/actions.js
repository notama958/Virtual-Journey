import axios from 'axios';
import {FLICK_KEY, GROUP} from './types';
const url = 'https://api.flickr.com/services/rest';
// const uri = 'https://live.staticflickr.com/65535/48451277551_27c72ae348_f.jpg';
import * as Location from 'expo-location';

export const getPhotoInfo = async id => {
  const response = await axios.get(url, {
    params: {
      method: 'flickr.photos.getInfo',
      api_key: FLICK_KEY,
      photo_id: id,
      format: 'json',
    },
  });
  // console.log(response);
  return response.data;
};
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
export const getPhotoBySearch = async (
  tags,
  {latitude, longitude},
  page = 1,
) => {
  const response = await axios.get(url, {
    params: {
      method: 'flickr.photos.search',
      api_key: FLICK_KEY,
      group_id: GROUP,
      tags: tags,
      format: 'json',
      per_page: 100,
      page: page,
      ...(latitude && longitude ? {lat: latitude, lon: longitude} : {}),
    },
  });
  return response.data;
};
export const getRandomPhoto = async () => {
  const response = await axios.get(url, {
    params: {
      method: 'flickr.photos.search',
      api_key: FLICK_KEY,
      group_id: GROUP,
      format: 'json',
      per_page: 100,
      page: Math.round(Math.random() * 100) + 1,
      sort: 'interestingness-desc',
    },
  });
  return response.data;
};
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
export const locationServiceEnabledAsync = async () => {
  let status = await Location.hasServicesEnabledAsync();
  return status;
};
export const formatDate = date => {
  // console.log(date);
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
