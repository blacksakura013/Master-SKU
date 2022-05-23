import React, { useEffect } from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { store, persistor } from './src/store/store';
import RNRestart from 'react-native-restart';

import LoginScreen from './screens/LoginScreen';
import SKUScreen from './screens/SKUScreen';
import NewSKUScreen from './screens/NewSKUScreen';
import AddbarSKUScreen from './screens/AddbarSKUScreen';
import Mainmenu from './screens/Mainmenu';
import ProductScreen from './screens/ProductScreen';
import ReportScreen from './screens/ReportScreen';
// import Report_prints from './screens/Report_prints';
// import Report_status from './screens/Report_status';
import Calendars from './screens/CalendarScreen/CalendarScreen';

import Scanbarcode from './screens/Scanbarcode';
import SelectBase from './pages/SelectBase';
import EditBase from './pages/EditBase';

import ScanScreen from './pages/ScanScreen';

import { Language, changeLanguage } from './translations/I18n';
import { FontSize } from './components/FontSizeHelper';

import Colors from './src/Colors';
import * as loginActions from './src/actions/loginActions';
import { useSelector, connect, useDispatch } from 'react-redux';
const App = () => {
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);


  useEffect(() => {
    if (loginReducer.language != 'th') {
      changeLanguage(loginReducer.language);
    } else {
      dispatch(loginActions.setLanguage('th'))
      changeLanguage('th');
    }



    //backsakura013
  }, []);

  const dispatch = useDispatch();
  const MainStack = createStackNavigator();

  const LoginStack = createStackNavigator();

  const BottomTabs = createBottomTabNavigator();


  const LoginStackScreen = () => {
    return (
      <LoginStack.Navigator>
        <LoginStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <LoginStack.Screen
          options={{ headerShown: false }}
          name="SelectScreen"
          component={SelectBase}
        />
        <LoginStack.Screen
          options={{ title: Language.t('selectBase.scanQR'), headerShown: false }}
          name="ScanScreen"
          component={ScanScreen}
        />
        <LoginStack.Screen
          options={{ headerShown: false }}
          name="EditBase"
          component={EditBase}
        />
      </LoginStack.Navigator>
    );
  }

  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <SafeAreaView style={styles.container1}>
            <MainStack.Navigator>

              <MainStack.Screen
                options={{ headerShown: false }}
                name="LoginStackScreen"
                component={LoginStackScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="SKUScreen"
                component={SKUScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="NewSKUScreen"
                component={NewSKUScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AddbarSKUScreen"
                component={AddbarSKUScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Mainmenu"
                component={Mainmenu}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ProductScreen"
                component={ProductScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Scanbarcode"
                component={Scanbarcode}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ReportScreen"
                component={ReportScreen}
              />
              {/* <MainStack.Screen
                options={{ headerShown: false }}
                name="Report_prints"
                component={Report_prints}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Report_status"
                component={Report_status}
              /> */}
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Calendars"
                component={Calendars}
              />
            </MainStack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}
const styles = StyleSheet.create({
  container1: {
    backgroundColor: 'black',
    flex: 1,

  },
  body: {
    margin: 10
  },
  body1e: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: 'flex-end'
  },
  body1: {
    marginTop: 20,
    flexDirection: "row",
  },
  tabbar: {
    height: 70,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: '#E6EBFF',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dorpdown: {
    justifyContent: 'center',
    fontSize: FontSize.medium,
  },
  dorpdownTop: {
    justifyContent: 'flex-end',
    fontSize: FontSize.medium,
  },
  textTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#ffff',
  },
  imageIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  textButton: {
    fontSize: FontSize.large,
    color: Colors.fontColor2,
  },
  buttonContainer: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
    borderBottomColor: '#ffff',
    color: '#ffff',
  },
  label: {
    margin: 8,
    color: '#ffff',
  },
});

export default App;
