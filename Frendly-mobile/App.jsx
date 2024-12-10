/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './src/global/store';
import { NavigationContainer } from '@react-navigation/native';
import Index from './src/modules/Index';
import { AppContext } from './src/Context';
import { Profile } from './src/modules/Profile';
import { Header } from './src/modules/Base';
import { Contact } from './src/modules/Contact';
import { Search } from './src/modules/Search';


function App() {
  const Stack = createNativeStackNavigator();
  const isDarkMode = useColorScheme() === 'dark';
	const [page, setPage] = useState("Home");
	const [contacts, setContacts] = useState([]);
	const [feedPosts,setFeedPosts] = useState([]);
	const [searchResult,setSearchResult] = useState([]);
	const [search,setSearch] = useState({search:'',category:''});

  return (
    <Provider store={store}>
    <StatusBar barStyle="default" translucent={false} />
      <AppContext.Provider value={{feedPosts,setFeedPosts,page,setPage,search,setSearch,searchResult,setSearchResult,contacts,setContacts }}>
      <NavigationContainer>
        <Header/>
        <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
          <Stack.Group>
            <Stack.Screen
              name="Home"
              options={{headerShown: false}}
              component={Index}
            />
            <Stack.Screen
              name="Profile"
              options={{headerShown: false}}
              component={Profile}
            />
            <Stack.Screen
              name="Contact"
              options={{headerShown: false}}
              component={Contact}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      </AppContext.Provider>
    </Provider>
  );
}


export default App;
