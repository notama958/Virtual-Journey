import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, SafeAreaView, Alert} from 'react-native';
import styles from '../css/styles';
// @ Child Components and actions
import RenderItem from './RenderItem';
import RenderSeparator from './RenderSeparator';
import RenderFooter from './RenderFooter';
import {getPhotoBySearch, getRandomPhoto} from '../api/actions';

// @ Parent-component for rendering Flatlist
// prop passed to ModalScreen includes imageArr,
//tag used, page, number of pages and location

const ModalScreen = ({route, navigation}) => {
  let {
    params: {location, tags, imageArr, pages, page},
  } = route;

  let [currList, setCurrList] = useState(imageArr); // hold state of current list
  let [iterator, setIterator] = useState(page); // iterator for load more images
  const [loadMore, setLoadMore] = useState(false); // reload state for load more images
  const [randomArr, setRandomArr] = useState([page]); // hold state of random array of page number
  const [emptyList, setEmptyList] = useState(
    // incase cannot find any images
    imageArr.length === 0 ? true : false,
  );

  // user is allowed to scroll up to 300 images
  const loadMorePhotos = async () => {
    if (currList.length < 300) {
      setLoadMore(true);
      // condition to start fetching to load more images
      if (!loadMore && pages > iterator) {
        let res;
        if (tags !== 'Random') {
          /**
           * Normal search => load more by iterating page by 1
           */
          setIterator(++iterator);
          res = await getPhotoBySearch(tags, location, iterator);
        } else {
          /**
           * Random search fetching random page within number of page (pages) with no duplication
           * getting the same number 5 times a round => fail to load more
           */
          let randomPage = Math.round(Math.random() * pages) + 1;
          let times = 0;
          while (randomArr.includes(randomPage) && times < 5) {
            randomPage = Math.round(Math.random() * pages) + 1;
            times++;
          }
          if (randomArr.includes(randomPage)) alert("Can't load more");
          else {
            setRandomArr([...randomArr, randomPage]);
            res = await getRandomPhoto(randomPage);
          }
        }
        if (res) {
          // parsing response date get from above
          const jsonString = res.slice(14, res.length - 1); // extract the jsonString
          let jsonFlickrApi = JSON.parse(jsonString);
          const {photos, stat} = jsonFlickrApi;
          if (stat !== 'ok') {
            setTimeout(() => alert('Something wrong!'), 500);
            return false;
          } else {
            // getting photo array
            let {photo} = photos;
            let tempArr = currList.concat(photo); // concatenate to current array
            setCurrList(tempArr); // set state for currList
            // finish load more
            setTimeout(() => {
              setLoadMore(false);
            }, 5000); // setState in 5s

            return true;
          }
        }
      }
    }
    return false;
  };

  // Change the screen header
  useEffect(() => {
    navigation.setOptions({title: tags});
  }, []);
  // Debugging purpose
  useEffect(() => {
    return () => {
      console.log('cleanup');
    };
  }, [currList]);

  return (
    /**
     * Please refer to the demo/Virtual_Journey.jpg
     */
    <View style={styles.flatlistContainer}>
      <FlatList
        data={currList}
        renderItem={({item}) => (
          <RenderItem item={item} navigation={navigation} id={item.id} />
        )}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          /**
           * Call loadMorePhotos once the scroll position
           * gets within onEndReachedThreshold of the rendered content.
           */
          (async function () {
            const isSuccessful = await loadMorePhotos();
            if (isSuccessful) console.log('Successful loaded');
            if (!isSuccessful) {
              setLoadMore(false);
              console.log('Fail loaded');
            }
          })();
        }}
        ItemSeparatorComponent={RenderSeparator} // Separate between each item (highlight+ separate each row)
        keyExtractor={(item, index) => index} // didn't use id here because there are some duplicate photos
        numColumns={3}
        extraData={currList}
        ListFooterComponent={
          emptyList ? (
            // incase array is empty
            <Text style={styles.footerText}>
              Cannot find any photo, please try another tag
            </Text>
          ) : (
            <RenderFooter loading={loadMore} />
          )
        }
      />
    </View>
  );
};
export default ModalScreen;
