import React, {useState, useEffect} from 'react';
// @ Child component
import ImageTag from './ImageTag';
/**
 * Child component of ModalScreen
 * item is passed with id, owner, server, secret, title
 * thumbnail image is loaded with server + id + secret
 * + active onPress to forward to Panorama Screen
 */

const RenderItem = ({item, navigation}) => {
  const {id, owner, server, secret, title} = item;

  const [url, setUrl] = useState(
    `https://live.staticflickr.com/${server}/${id}_${secret}_`,
  );

  return (
    <ImageTag
      item={item}
      onPress={() => {
        /**
         * navigate Panorama screen
         */
        navigation.navigate('Panorama', {
          id: id,
          owner: owner,
          secret: secret,
          server: server,
          title: title,
        });
      }}
      url={url + 'q.jpg'}
    />
  );
};

export default RenderItem;
