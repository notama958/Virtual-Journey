import React from 'react';
import {ActivityIndicator} from 'react-native';
const RenderFooter = ({loading}) => {
  //it will show indicator at the bottom of the list when data is loading otherwise it returns null
  if (!loading) return null;
  return <ActivityIndicator size="large" color="#5BC8AF" />;
};

export default RenderFooter;
