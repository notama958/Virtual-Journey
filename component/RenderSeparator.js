import React from 'react';
import {View} from 'react-native';
// @ Child component for Modal Screen
// more like a styling effect for load more function
const RenderSeparator = () => {
  return (
    <View
      style={{
        height: 2,
        width: '100%',
        backgroundColor: '#CED0CE',
      }}
    />
  );
};
export default RenderSeparator;
