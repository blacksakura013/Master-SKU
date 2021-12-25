import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
  BackHandler,
  StatusBar,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";

import {
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';

import { SafeAreaView } from 'react-native-safe-area-context';


import { useStateIfMounted } from 'use-state-if-mounted';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


import { useSelector, connect, useDispatch } from 'react-redux';



import { Language } from '../translations/I18n';
import { FontSize } from '../components/FontSizeHelper';


import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';

import Colors from '../src/Colors';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;



  const [GUID, setGUID] = useStateIfMounted('');

  const [isSelected, setSelection] = useState(loginReducer.userloggedIn == true ? loginReducer.userloggedIn : false);
  const [isSFeatures, setSFeatures] = useState(loginReducer.isSFeatures == true ? loginReducer.isSFeatures : false);

  const [loading, setLoading] = useStateIfMounted(false);
  const [resultJson, setResultJson] = useState([]);
  const [marker, setMarker] = useState(false);
  const [username, setUsername] = useState(loginReducer.userloggedIn == true ? loginReducer.userNameED : '');
  const [password, setPassword] = useState(loginReducer.userloggedIn == true ? loginReducer.passwordED : '');

  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });

  useEffect(() => {
    console.log('>> isSFeatures : ',isSFeatures)
    getMac()


  }, []);
  useEffect(() => {
    console.log('>> machineNum :', registerReducer.machineNum + '\n\n\n\n')
  }, [registerReducer.machineNum]);

  const closeLoading = () => {
    setLoading(false);
  };
  const letsLoading = () => {
    setLoading(true);
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const getMac = async () => {
    var lodstr = ''
    for (var i = 0; i < 100; i++) {
      lodstr += '_'


    }


    await DeviceInfo.getMacAddress().then((mac) => {
      var a = Math.floor(100000 + Math.random() * 900000);
      console.log(DeviceInfo.getDeviceName())
      console.log('\nmachine > > ' + mac + ':' + a)
      if (mac.length > 0) dispatch(registerActions.machine(mac));
      else NetworkInfo.getBSSID().then(macwifi => {
        console.log('\nmachine(wifi) > > ' + macwifi)
        if (macwifi.length > 0) dispatch(registerActions.machine(macwifi));
        else dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e'));
      }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e')));
    }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e')));
  }

  useEffect(() => {
  }, [])


  const tslogin = async () => {
    await setLoading(true)
    await regisMacAddED()
    await regisMacAdd()
    await setLoading(false)
  }

  const regisMacAdd = async () => {

    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE":"' +
          registerReducer.machineNum +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "0828845662"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          await _fetchGuidLog();
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);
        console.log('http', databaseReducer.Data.urlser);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }

      });
  };

  const _fetchGuidLog = async () => {
    console.log('FETCH GUID LOGIN ', databaseReducer.Data.urlser);
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Login',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "' +
          username +
          '","BPAPUS-PASSWORD": "' +
          password +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.ResponseCode == '635') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          console.log('NOT FOUND MEMBER');
        } else if (json && json.ResponseCode == '629') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else if (json && json.ResponseCode == '200') {
          let responseData = JSON.parse(json.ResponseData)
          dispatch(loginActions.guid(responseData.BPAPUS_GUID))
          dispatch(loginActions.userNameED(username))
          dispatch(loginActions.passwordED(password))
          dispatch(loginActions.userlogin(isSelected))

          navigation.dispatch(
            navigation.replace('SKUScreen', {})
          )
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);

        } else {

          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError') + "1", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      });
    setLoading(false)
  };
  const regisMacAddED = async () => {
    await fetch(loginReducer.endpointMother + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE":"' +
          registerReducer.machineNum +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "0828845662"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          await _fetchGuidLogED();
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);
        console.log('http', loginReducer.endpointMother);
        if (loginReducer.endpointMother == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }

      });
  };

  const _fetchGuidLogED = async () => {
    console.log('FETCH GUID LOGIN ', loginReducer.endpointMother);
    await fetch(loginReducer.endpointMother + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Login',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "' +
          username +
          '","BPAPUS-PASSWORD": "' +
          password +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.ResponseCode == '635') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          console.log('NOT FOUND MEMBER');
        } else if (json && json.ResponseCode == '629') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else if (json && json.ResponseCode == '200') {
          let responseData = JSON.parse(json.ResponseData)
          dispatch(loginActions.guidEndPoint(responseData.BPAPUS_GUID))

        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        if (loginReducer.endpointMother == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);

        } else {

          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError') + "1", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      });

  };

  return (

    <SafeAreaView style={container1}>
      <StatusBar hidden={true} />
      <ScrollView>
        <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
          <View style={tabbar}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectScreen')}>
              <FontAwesomeIcon name="gear" size={30} color={'white'} />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 12,
                fontSize: FontSize.medium,
                color: Colors.fontColor2,
              }}></Text>
          </View>
          <TouchableNativeFeedback>
            <Image
              style={topImage}
              resizeMode={'contain'}
              source={require('../images/barcode.png')}
            />
          </TouchableNativeFeedback>

          <View style={{ margin: 10 }}>
            <View
              style={{
                backgroundColor: Colors.backgroundLoginColorSecondary,
                flexDirection: 'column',
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 10
              }}>
              <View style={{ height: 40, flexDirection: 'row' }}>
                <FontAwesomeIcon name="user" size={30} color={Colors.backgroundLoginColor} />
                <TextInput
                  style={{
                    flex: 8,
                    marginLeft: 10,
                    borderBottomColor: Colors.borderColor,
                    color: Colors.fontColor,
                    paddingVertical: 7,
                    fontSize: FontSize.medium,
                    borderBottomWidth: 0.7,
                  }}

                  placeholderTextColor={Colors.fontColorSecondary}
                  value={username}
                  maxLength={10}
                  placeholder={Language.t('login.username')}
                  onChangeText={(val) => {
                    setUsername(val);
                  }}></TextInput>
              </View>
            </View>
          </View>

          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <View
              style={{
                backgroundColor: Colors.backgroundLoginColorSecondary,
                flexDirection: 'column',

                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 10

              }}>

              <View style={{ height: 40, flexDirection: 'row' }}>
                <FontAwesomeIcon name="lock" size={30} color={Colors.backgroundLoginColor} />
                <TextInput
                  style={{
                    flex: 8,
                    marginLeft: 10,
                    color: Colors.fontColor,
                    paddingVertical: 7,
                    fontSize: FontSize.medium,
                    borderBottomColor: Colors.borderColor,
                    borderBottomWidth: 0.7,
                  }}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  keyboardType="default"
                  maxLength={8}
                  value={password}
                  placeholderTextColor={Colors.fontColorSecondary}
                  placeholder={Language.t('login.password')}
                  onChangeText={(val) => {
                    setPassword(val);
                  }}
                />

                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <FontAwesomeIcon
                      name="eye-slash"
                      size={25}
                      color={Colors.buttonColorPrimary}
                    />
                  ) : (
                    <FontAwesomeIcon
                      name="eye"
                      size={25}
                      color={Colors.buttonColorPrimary}></FontAwesomeIcon>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.checkboxContainer}>
            <View></View>
            <CheckBox
              value={isSelected}
              onValueChange={(value) => setSelection(value)}

              tintColors={{ true: '#FFFF', false: '#FFFF' }}
              style={styles.checkbox}
            />
            <Text style={styles.label}>จดจำรหัสผ่าน</Text>
          </View>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <TouchableNativeFeedback
                onPress={() => tslogin()}>
                <View
                  style={{
                    borderRadius: 10,
                    flexDirection: 'column',
                    padding: 20,
                    backgroundColor: Colors.buttonColorPrimary,
                  }}>
                  <Text
                    style={{
                      color: Colors.fontColor2,
                      alignSelf: 'center',
                      fontSize: FontSize.medium,
                      fontWeight: 'bold',
                    }}>
                    {Language.t('login.buttonLogin')}
                  </Text>
                </View>
              </TouchableNativeFeedback>


            </View>
          </View>

        </KeyboardAvoidingView>
        <View style={{ marginTop: 10, alignItems: 'center' }} >
          <View style={styles.checkboxContainer}>
            <View></View>
            <CheckBox
              value={isSFeatures}
              onValueChange={(value) => setSFeatures(value)}

              tintColors={{ true: '#FFFF', false: '#FFFF' }}
              style={styles.checkbox}
            />
            <Text style={styles.label}>ใช้คุณสมบัติตามมาตรฐาน</Text>
          </View>
          <Text style={{
            color: Colors.buttonColorPrimary,
            alignSelf: 'center',
            fontSize: FontSize.medium,
            fontWeight: 'bold',
          }}>{'25/12'}</Text>
        </View>
      </ScrollView>
      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            opacity: 0.5,
            backgroundColor: 'black',
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
          }}>
          <ActivityIndicator
            style={{
              borderRadius: 15,
              backgroundColor: null,
              width: 100,
              height: 100,
              alignSelf: 'center',
            }}
            animating={loading}
            size="large"
            color={Colors.lightPrimiryColor}
          />
        </View>
      )}

    </SafeAreaView>


  );
};

const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundLoginColor,
    flex: 1,
    flexDirection: 'column',
  },
  container2: {
    width: deviceWidth,
    height: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    flex: 1,
  },
  tabbar: {
    height: 70,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textTitle2: {
    alignSelf: 'center',
    flex: 2,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  imageIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: null,

    height: deviceWidth / 2,
    marginBottom: 50
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
    marginTop: 10,
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


export default LoginScreen;
