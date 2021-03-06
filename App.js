import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './component/HomeScreen';
import ModalScreen from './component/ModalScreen';
import Panorama from './component/Panorama';
import Storage from './component/Storage';
const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    // acts as navigator when switching between screens
    // Panorama (no header) <-> Storage <-> Home <-> Modal <-> Panorama (no header)
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        options={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#1A1B25',
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
      <MainStack.Screen
        name="Storage"
        component={Storage}
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
    // RootStack set headless screen
    <NavigationContainer>
      <RootStack.Navigator mode="modal" headerMode="none">
        <RootStack.Screen name="Main" component={MainStackScreen} />
        <RootStack.Screen name="Panorama" component={Panorama} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
