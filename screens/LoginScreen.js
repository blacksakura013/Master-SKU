import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
  BackHandler,
  StatusBar,

  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";



import { SafeAreaView } from 'react-native-safe-area-context';


import { useStateIfMounted } from 'use-state-if-mounted';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


import { useSelector, connect, useDispatch } from 'react-redux';



import { Language, changeLanguage } from '../translations/I18n';
import { FontSize } from '../components/FontSizeHelper';


import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as activityActions from '../src/actions/activityActions';
import * as databaseActions from '../src/actions/databaseActions';

import Colors from '../src/Colors';
import { fontSize, fontWeight } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const activityReducer = useSelector(({ activityReducer }) => activityReducer);
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;

  useEffect(() => {
    const RPTSVR_GRANT = '{E72B8A49-6A7E-48EC-BA4C-5B699D1376D1}'
    if (loginReducer.language.length > 0) {
      changeLanguage(loginReducer.language);
    } else {
      dispatch(loginActions.setLanguage('th'))
      changeLanguage('th');
    }

    if (RPTSVR_GRANT != activityReducer.RPTSVR_GRANT)
      dispatch(activityActions.RPTSVR_GRANT(RPTSVR_GRANT))
    // if (!databaseReducer.Data.urlser)
    //   navigation.navigate('SelectScreen', {})
    //backsakura013
  }, []);

  let ED = false
  const [GUID, setGUID] = useStateIfMounted('');

  const [isSelected, setSelection] = useState(loginReducer.userloggedIn == true ? loginReducer.userloggedIn : false);
  const [isSFeatures, setSFeatures] = useState(loginReducer.isSFeatures == true ? loginReducer.isSFeatures : false);

  const [loading, setLoading] = useStateIfMounted(false);
  const [loading_backG, setLoading_backG] = useStateIfMounted(true);

  const [resultJson, setResultJson] = useState([]);
  const [marker, setMarker] = useState(true);
  const [username, setUsername] = useState(loginReducer.userloggedIn == true ? loginReducer.userNameED : '');
  const [password, setPassword] = useState(loginReducer.userloggedIn == true ? loginReducer.passwordED : '');

  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
  const image = '../images/UI/Login/4x/Asset3_4x.png';
  const endpointMother = 'https://basket.businessplus.co.th:8890/read/bplusget.dll';
  useEffect(() => {
    console.log('>> isSFeatures : ', isSFeatures)
    if (registerReducer.machineNum.length == 0)
      getMac()

    console.log('>> Language : ', Language.getLang())

  }, []);
  useEffect(() => {
    dispatch(loginActions.setFingerprint(isSFeatures));

  }, [isSFeatures]);
  useEffect(() => {
    console.log(`>> endpointMother : ${endpointMother}`)
    console.log(`>> databaseReducer : ${databaseReducer.Data.nameser}`)
    console.log('>> machineNum :', registerReducer.machineNum)
    console.log('>> RPTSVR_GRANT :', activityReducer.RPTSVR_GRANT + '\n\n\n\n')

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


  const fetchData = async (guidEndPoint) => {
    console.log(guidEndPoint)
    await fetch(endpointMother + '/LookupErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': guidEndPoint,
        'BPAPUS-FUNCTION': 'Ic000301',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0'
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        let responseData = JSON.parse(json.ResponseData);
        if (responseData.RECORD_COUNT > 0) {
          console.log(responseData)
          let temp_UTQ = [];
          let UTQ = responseData.Ic000301

          UTQ.sort((a, b) => (parseInt(a.UTQ_NAME) > parseInt(b.UTQ_NAME)) ? 1 : ((parseInt(b.UTQ_NAME) > parseInt(a.UTQ_NAME)) ? -1 : 0))

          for (var i in UTQ) {
            let temp_Obj = {
              id: i,
              name: UTQ[i].UTQ_NAME,
              UTQ_QTY: UTQ[i].UTQ_QTY,
              UTQ_KEY: UTQ[i].UTQ_KEY,
            }
            temp_UTQ.push(temp_Obj)
          }
          await dispatch(activityActions.UTQ(temp_UTQ))
          await dispatch(loginActions.endpointMother(endpointMother))
        } else {
          console.log(responseData)
        }

      })
      .catch((error) => {


        console.error('ERROR at fetchContent >> ' + error)
      })
  }

  const getMac = async () => {
    var lodstr = ''
    for (var i = 0; i < 100; i++) {
      lodstr += '_'
    }
    await DeviceInfo.getMacAddress().then((mac) => {
      var a = Math.floor(100000 + Math.random() * 900000);
      console.log(DeviceInfo.getDeviceName())
      console.log('\nmachine > > ' + mac + ':' + a)
      if (mac.length > 0) dispatch(registerActions.machine(mac + ':' + a));
      else NetworkInfo.getBSSID().then(macwifi => {
        console.log('\nmachine(wifi) > > ' + macwifi + ':' + a)
        if (macwifi.length > 0) dispatch(registerActions.machine(macwifi + ':' + a));
        else dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e' + ':' + a));
      }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e' + ':' + a)));
    }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e' + ':' + a)));
  }

  useEffect(() => {
    console.log('databaseReducer > ', databaseReducer)
    console.log('endpointMother > ', endpointMother)
  }, [])


  const tslogin = async () => {
    ED = false
    await setLoading(true)
    await regisMacAddED()
    if (ED == true)
      await regisMacAdd()
    await setLoading(false)
  }

  const regisMacAdd = async () => {
    console.log('databaseReducer ', databaseReducer.Data.urlser)
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
            Language.t('alert.internetError') + Language.t('selectBase.UnableConnec1') + ' ' + databaseReducer.Data.nameser + ' ' + Language.t('selectBase.UnableConnec2'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
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
          username.toUpperCase() +
          '","BPAPUS-PASSWORD": "' +
          password.toUpperCase() +
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
            navigation.replace('Mainmenu', {})
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
            Language.t('alert.internetError') + Language.t('selectBase.UnableConnec1') + ' ' + databaseReducer.Data.nameser + ' ' + Language.t('selectBase.UnableConnec2'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
      });

  };
  const regisMacAddED = async () => {
    await fetch(endpointMother + '/DevUsers', {
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
          console.log('>> ', json)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          ED = false
        }
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);
        console.log('http', endpointMother);
        if (endpointMother == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          let tempurl = endpointMother.split(':8890')
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError') + Language.t('selectBase.UnableConnec1') + ' ' + tempurl[0] + ' ' + Language.t('selectBase.UnableConnec2'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        ED = false
      });

  };

  const _fetchGuidLogED = async () => {
    console.log('FETCH GUID LOGIN ', endpointMother);
    await fetch(endpointMother + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Login',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "BUSINESS","BPAPUS-PASSWORD": "SYSTEM"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.ResponseCode == '635') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          console.log('NOT FOUND MEMBER');
          ED = false
        } else if (json && json.ResponseCode == '629') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          ED = false
        } else if (json && json.ResponseCode == '200') {
          let responseData = JSON.parse(json.ResponseData)
          dispatch(loginActions.guidEndPoint(responseData.BPAPUS_GUID))
          fetchData(responseData.BPAPUS_GUID)
          ED = true
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          ED = false
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        if (endpointMother == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          let tempurl = endpointMother.split(':8890')
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError') + Language.t('selectBase.UnableConnec1') + ' ' + tempurl[0] + ' ' + Language.t('selectBase.UnableConnec2'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        ED = false
      });

  };

  return (

    <SafeAreaView style={container1}>
      <StatusBar hidden={true} />
      <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={styles.image}>
        {!loading_backG ?
          <ScrollView>
            <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
              <View style={tabbar}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SelectScreen', { data: '' })}>
                  <FontAwesomeIcon name="gear" size={30} color={Colors.backgroundLoginColorSecondary} />
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 12,
                    fontSize: FontSize.medium,
                    color: Colors.backgroundLoginColorSecondary,
                  }}></Text>
              </View>
              <View>
                <TouchableNativeFeedback>
                  <Image
                    style={topImage}
                    resizeMode={'contain'}
                    source={require('../images/UI/Login/4x/Asset4_4x.png')}
                  />
                </TouchableNativeFeedback>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: FontSize.large * 2, color: Colors.fontColor, fontWeight: 'bold' }}>Master SKU</Text>
                </View>
              </View>


              <View style={{ margin: 10 }}>
                <View
                  style={{
                    backgroundColor: Colors.backgroundLoginColorSecondary,
                    flexDirection: 'column',
                    borderRadius: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 20,
                    paddingBottom: 10,

                    shadowColor: Colors.borderColor,
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.0,

                    elevation: 15,
                  }}>
                  <View style={{ height: 40, flexDirection: 'row' }}>
                    <Image
                      style={{ height: 30, width: 30 }}
                      resizeMode={'contain'}
                      source={require('../images/UI/Login/4x/Asset7_4x.png')}
                    />

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
                    paddingBottom: 10,

                    shadowColor: Colors.borderColor,
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.0,

                    elevation: 15,
                  }}>

                  <View style={{ height: 40, flexDirection: 'row' }}>
                    <Image
                      style={{ height: 30, width: 30 }}
                      resizeMode={'contain'}
                      source={require('../images/UI/Login/4x/Asset8_4x.png')}
                    />
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
                          color={Colors.borderColor}
                        />
                      ) : (
                        <FontAwesomeIcon
                          name="eye"
                          size={25}
                          color={Colors.borderColor}></FontAwesomeIcon>
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

                  tintColors={{ true: Colors.fontColor, false: Colors.fontColor }}
                  style={styles.checkbox}
                />
                <Text style={styles.label}>{Language.t('login.rememberpassword')}</Text>
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
                          color: Colors.buttonTextColor,
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

                  tintColors={{ true: Colors.fontColor, false: Colors.fontColor }}
                  style={styles.checkbox}
                />
                <Text style={styles.label}> {Language.t('login.usestandard')}</Text>
              </View>
              <Text style={Colors.headerColor2}>version 2.2.18</Text>

            </View>
          </ScrollView> : <View
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

          </View>}
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
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container1: {

    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    justifyContent: "center"
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
    borderBottomColor: Colors.fontColor,
    color: Colors.fontColor,

  },
  label: {
    margin: 8,
    color: Colors.fontColor,
  },
});


export default LoginScreen;
