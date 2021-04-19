import * as React from 'react';
import {Button, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import styles from './css/styles';

import HomeScreen from './component/HomeScreen';
import ModalScreen from './component/ModalScreen';
import Panorama from './component/Panorama';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        options={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#523A34',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        component={HomeScreen}
      />
      <MainStack.Screen
        name="Modal"
        component={ModalScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#523A34',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </MainStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" headerMode="none">
        <RootStack.Screen name="Main" component={MainStackScreen} />
        <RootStack.Screen name="Panorama" component={Panorama} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
