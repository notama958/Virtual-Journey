import React, {useEffect, useState} from 'react';
// @ Child component
import ImageTag from './ImageTag';
/**
 * Same function like RenderItem but for Storage Screen
 * only require item local url like /image_XXX.jpg
 * reuse of ImageTag for rendering each item
 */
const RenderFromStorage = ({item, navigation, reload}) => {
  const path = 'file:///storage/emulated/0/Download/VJ/';

  return (
    <ImageTag
      item={item}
      onPress={() =>
        // move to screen Panorama
        {
          alert('Pressed');
          navigation.navigate('Panorama', {
            url: path + item,
          });
        }
      }
      url={path + item}
      setReload={reload}
    />
  );
};

export default RenderFromStorage;
