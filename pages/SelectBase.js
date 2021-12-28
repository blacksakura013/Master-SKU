import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Text,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import { Picker, } from 'native-base';
import { useStateIfMounted } from 'use-state-if-mounted';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNRestart from 'react-native-restart';
import {
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../src/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FontSize } from '../components/FontSizeHelper';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog';
import { Language, changeLanguage } from '../translations/I18n';

import DeviceInfo from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';
import { color } from 'styled-system';

const SelectBase = ({ route }) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;

  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);

  const [selectedValue, setSelectedValue] = useState('');
  const [selectbaseValue, setSelectbaseValue] = useState(databaseReducer.Data.nameser ? databaseReducer.Data.nameser : "-1");
  const [selectlanguage, setlanguage] = useState(Language.getLang() == 'th' ? 'th' : 'en');
  const [basename, setBasename] = useState('');
  const [baseurl, setBsaeurl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);

  const [machineNo, setMachineNo] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
  const image = '../images/UI/endpoint/4x/Asset12_4x.png';
  const setlanguageState = (itemValue) => {
    dispatch(loginActions.setLanguage(itemValue))


    console.log(itemValue)
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  useEffect(() => {
    if (loginReducer.language != Language.getLang()) {
      console.log('loginReducer.Language >> ', loginReducer.language)
      changeLanguage(loginReducer.language);
      setlanguage(loginReducer.language)
      RNRestart.Restart();
    }

    //backsakura 
  }, [loginReducer.language]);
  useEffect(() => {
    console.log('>> Address :', loginReducer.ipAddress)
  }, []);


  useEffect(() => {
    if (route.params?.post) {
      setBasename(route.params.post.value)
      setBsaeurl(route.params.post.label)
    }
  }, [route.params?.post]);

  const _onPressSelected = async () => {
    setLoading(true)
    for (let i in loginReducer.ipAddress) {
      if (loginReducer.ipAddress[i].nameser == selectbaseValue) {
        dispatch(databaseActions.setData(loginReducer.ipAddress[i]));
        Alert.alert(
          Language.t('alert.succeed'),
          Language.t('selectBase.connect') + ' ' + selectbaseValue + ' ' + Language.t('alert.succeed'), [{
            text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
              navigation.replace('LoginStackScreen')
            )
          }]);

      }
    }
  }
  const _onPressEdit = () => {
    navigation.navigate('EditBase', {
      selectbaseValue: selectbaseValue,
    });
  }
  const checkValue = () => {
    let c = true
    if (basename == '') {
      Alert.alert(Language.t('alert.incorrect'))
      c = false
    }
    else if (baseurl == '') {
      Alert.alert(Language.t('alert.incorrect'))
      c = false
    }
    else if (username == '') {
      Alert.alert(Language.t('alert.incorrect'))
      c = false
    }
    else if (password == '') {
      Alert.alert(Language.t('alert.incorrect'))
      c = false
    }
    return c
  }
  const _onPressAddbase = async () => {
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    let temp = []
    let check = false;
    setLoading(true)
    if (checkValue() == true) {


      temp = loginReducer.ipAddress;
      for (let i in loginReducer.ipAddress) {
        if (
          loginReducer.ipAddress[i].nameser == basename
        ) {

          Alert.alert('', Language.t('selectBase.Alert'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          check = true;

          break;
        } else if (
          loginReducer.ipAddress[i].urlser == newurl
        ) {

          Alert.alert('', Language.t('selectBase.Alert'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          check = true;

          break;
        }
      }
      if (!check) {
        checkIPAddress()
      } else {
        setLoading(false)
      }

    } else {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      setLoading(false)
    }

  }



  const checkIPAddress = async () => {
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    let temp = []

    await fetch(baseurl + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{ "BPAPUS-MACHINE": "11111122","BPAPUS-CNTRY-CODE": "66", "BPAPUS-MOBILE": "0828845662"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          fetch(newurl + '/DevUsers', {
            method: 'POST',
            body: JSON.stringify({
              'BPAPUS-BPAPSV': loginReducer.serviceID,
              'BPAPUS-LOGIN-GUID': '',
              'BPAPUS-FUNCTION': 'Login',
              'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE": "11111122","BPAPUS-USERID": "' +
                username +
                '","BPAPUS-PASSWORD": "' +
                password +
                '"}',
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              if (json && json.ResponseCode == '200') {

                let newObj = {
                  nameser: basename,
                  urlser: newurl,
                  usernameser: username,
                  passwordser: password
                }
                if (loginReducer.ipAddress.length > 0) {
                  for (let i in loginReducer.ipAddress) {
                    temp.push(loginReducer.ipAddress[i])
                  }
                }
                temp.push(newObj)
                dispatch(loginActions.ipAddress(temp))
                dispatch(databaseActions.setData(newObj))
                Alert.alert(
                  Language.t('alert.succeed'),
                  Language.t('selectBase.connect') + ' ' + basename + ' ' + Language.t('alert.succeed'), [{
                    text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
                      navigation.replace('LoginStackScreen')
                    )
                  }]);
              } else {
                console.log('Function Parameter Required');
                let temp_error = 'error_ser.' + json.ResponseCode;
                console.log('>> ', temp_error)
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
              }
              setLoading(false)
            })
            .catch((error) => {
              Alert.alert(
                Language.t('alert.errorTitle'),
                Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
              console.error('_fetchGuidLogin ' + error);
              setLoading(false)
            });
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)
      })
      .catch((error) => {
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        console.log('checkIPAddress');
        setLoading(false)
      });


  };

  return (
    <View style={container1}>
      <ImageBackground source={require(image)} resizeMode="cover" style={styles.image}>
        <ImageBackground source={require('../images/UI/endpoint/4x/Asset13_4x.png')} resizeMode="cover" style={topImage}>
          <View style={tabbar}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={{ color: Colors.backgroundLoginColorSecondary, }} size={FontSize.large} />
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: FontSize.medium,
                  color: Colors.backgroundLoginColorSecondary,
                }}> {Language.t('selectBase.header')}</Text>
            </View>
            <View>
              <Picker
                selectedValue={selectlanguage}
                style={{ color: Colors.backgroundLoginColorSecondary, width: 110 }}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => Alert.alert('', Language.t('menu.changeLanguage'), [{ text: Language.t('alert.ok'), onPress: () => setlanguageState(itemValue) }, { text: Language.t('alert.cancel'), onPress: () => { } }])} >
                <Picker.Item label="TH" value="th" />
                <Picker.Item label="EN" value="en" />
              </Picker>
            </View>
          </View>
        </ImageBackground>
        <ScrollView>
          <SafeAreaView >
            <KeyboardAvoidingView >
              <View style={styles.body}>
                {Platform.OS == 'ios' ? (
                  <>
                    <View style={styles.body1}>
                      <Text style={styles.textTitle}>
                        {Language.t('selectBase.title')} :
                      </Text>
                    </View>
                    <View style={styles.body1}>
                      {loginReducer.ipAddress.length > 0 ? (
                        <Picker
                          selectedValue={selectbaseValue}
                          enabled={true}
                          mode="dropdown"
                          style={{
                            color: Colors.backgroundColorSecondary, width: deviceWidth * 0.95, flexDirection: 'column',
                            justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10,
                          }}
                          onValueChange={(itemValue, itemIndex) => setSelectbaseValue(itemValue)}>
                          {loginReducer.ipAddress.map((obj, index) => {
                            return (
                              <Picker.Item color={Colors.backgroundColorSecondary} label={obj.nameser} value={obj.nameser} />
                            )
                          })}
                        </Picker>
                      ) : (
                        <Picker
                          selectedValue={selectbaseValue}
                          onValueChange={(itemValue, itemIndex) => setSelectbaseValue(itemValue)}
                          enabled={false}
                          mode="dropdown"
                          style={{
                            color: Colors.backgroundColorSecondary, width: deviceWidth * 0.95, flexDirection: 'column',
                            justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10,
                          }}
                        >
                          {
                            <Picker.Item
                              value="-1"
                              color={Colors.backgroundColorSecondary}
                              label={Language.t('selectBase.lebel')}
                            />
                          }
                        </Picker>
                      )}
                    </View>

                  </>
                ) : (
                  <>
                    <View style={styles.body1}>
                      <Text style={styles.textTitle}>
                        {Language.t('selectBase.title')} :
                      </Text>
                    </View>
                    <View style={{
                      marginTop: 10, flexDirection: 'row',
                      justifyContent: 'center', borderColor: loginReducer.ipAddress.length > 0 ? Colors.borderColor : '#979797', backgroundColor: Colors.backgroundColorSecondary, borderWidth: 1, padding: 10, borderRadius: 10,
                    }}>

                      <Text style={{ fontSize: FontSize.large }}></Text>

                      {loginReducer.ipAddress.length > 0 ? (
                        <Picker
                          selectedValue={selectbaseValue}
                          enabled={true}
                          mode="dropdown"
                          state={{ color: Colors.borderColor, backgroundColor: Colors.backgroundColorSecondary }}
                          onValueChange={(itemValue, itemIndex) => setSelectbaseValue(itemValue)}>
                          {loginReducer.ipAddress.map((obj, index) => {
                            return (
                              <Picker.Item label={obj.nameser} color={Colors.borderColor} value={obj.nameser} />
                            )
                          })}
                        </Picker>
                      ) : (
                        <Picker
                          selectedValue={selectbaseValue}
                          state={{ color: Colors.borderColor, backgroundColor: Colors.backgroundColorSecondary }}
                          onValueChange={(itemValue, itemIndex) => setSelectbaseValue(itemValue)}
                          enabled={false}
                          mode="dropdown"

                        >
                          {
                            <Picker.Item
                              value="-1"
                              color={'#979797'}
                              label={Language.t('selectBase.lebel')}
                            />
                          }
                        </Picker>
                      )}
                    </View>
                  </>
                )}
                {loginReducer.ipAddress.length > 0 ? (
                  <View style={styles.body1e}>
                    <TouchableNativeFeedback
                      onPress={() => _onPressSelected()}>
                      <View
                        style={{
                          borderRadius: 10,
                          flexDirection: 'column',
                          marginLeft: 10,
                          paddingTop: 10,
                          paddingBottom: 10,
                          width: 100,
                          backgroundColor: Colors.buttonColorPrimary,
                        }}>
                        <Text
                          style={{
                            color: Colors.buttonTextColor,
                            alignSelf: 'center',
                            fontSize: FontSize.medium,
                            fontWeight: 'bold',

                          }}>
                          {Language.t('selectBase.connect')}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                      onPress={() => _onPressEdit()}>
                      <View
                        style={{
                          borderRadius: 10,
                          flexDirection: 'column',
                          marginLeft: 10,
                          paddingTop: 10,
                          paddingBottom: 10,
                          width: 100,
                          backgroundColor: Colors.backgroundLoginColor,
                        }}>
                        <Text
                          style={{
                            color: Colors.backgroundColorSecondary,
                            alignSelf: 'center',
                            fontSize: FontSize.medium,
                            fontWeight: 'bold',
                          }}>
                          {Language.t('selectBase.edit')}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                ) : (
                  <>
                    <View style={styles.body1e}>
                      <TouchableNativeFeedback
                        onPress={() => null}>
                        <View
                          style={{
                            borderRadius: 10,
                            flexDirection: 'column',
                            marginLeft: 10,
                            paddingTop: 10,
                            paddingBottom: 10,
                            width: 100,
                            backgroundColor: '#979797',
                          }}>
                          <Text
                            style={{
                              color: '#C5C5C5',
                              alignSelf: 'center',
                              fontSize: FontSize.medium,
                              fontWeight: 'bold',
                            }}>
                            {Language.t('selectBase.connect')}
                          </Text>
                        </View>
                      </TouchableNativeFeedback>
                      <TouchableNativeFeedback
                        onPress={() => null}>
                        <View
                          style={{
                            borderRadius: 10,
                            flexDirection: 'column',
                            marginLeft: 10,
                            paddingTop: 10,
                            paddingBottom: 10,
                            width: 100,
                            backgroundColor: '#979797',
                          }}>
                          <Text
                            style={{
                              color: '#C5C5C5',
                              alignSelf: 'center',
                              fontSize: FontSize.medium,
                              fontWeight: 'bold',
                            }}>
                            {Language.t('selectBase.edit')}
                          </Text>
                        </View>
                      </TouchableNativeFeedback>
                    </View>
                  </>
                )}
                
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {Language.t('selectBase.name')} :
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      height: 50,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      paddingBottom: 10,


                    }}>
                    <View style={{ height: 30, flexDirection: 'row' }}>
                      <Image
                        style={{ height: 30, width: 30 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/endpoint/4x/Asset18_4x.png')}
                      />
                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 10,
                          borderBottomColor: Colors.borderColor,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          borderBottomWidth: 0.7,
                        }}

                        placeholderTextColor={Colors.backgroundColor}

                        placeholder={Language.t('selectBase.name') + '..'}
                        value={basename}
                        onChangeText={(val) => {
                          setBasename(val);
                        }}></TextInput>
                      <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('ScanScreen', { route: 'SelectScreen' })}>

                        <FontAwesome
                          name="qrcode"
                          size={25}
                          color={Colors.borderColor}
                        />

                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {Language.t('selectBase.url')} :
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      height: 50,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      height: 'auto',
                      paddingBottom: 10

                    }}>
                    <View style={{ height: 'auto', flexDirection: 'row' }}>
                      <Image
                        style={{ height: 30, width: 30 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/endpoint/4x/Asset19_4x.png')}
                      />
                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 10,
                          borderBottomColor: Colors.borderColor,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          height: 'auto',
                          borderBottomWidth: 0.7,
                        }}
                        multiline={true}
                        placeholderTextColor={Colors.backgroundColor}

                        value={baseurl}
                        placeholder={Language.t('selectBase.url') + '..'}
                        onChangeText={(val) => {
                          setBsaeurl(val);
                        }}></TextInput>

                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {Language.t('login.username')} :
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      height: 50,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }}>
                    <View style={{ height: 30, flexDirection: 'row' }}>
                      <Image
                        style={{ height: 30, width: 30 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/endpoint/4x/Asset20_4x.png')}
                      />
                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 5,
                          borderBottomColor: Colors.borderColor,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          borderBottomWidth: 0.7,
                        }}

                        placeholderTextColor={Colors.backgroundColor}

                        value={username}
                        placeholder={Language.t('login.username') + '..'}
                        onChangeText={(val) => {
                          setUsername(val);
                        }}></TextInput>

                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textTitle}>
                    {Language.t('login.password')} :
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      backgroundColor: Colors.backgroundColorSecondary,
                      flexDirection: 'column',
                      height: 50,
                      borderRadius: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }}>
                    <View style={{ height: 30, flexDirection: 'row' }}>
                      <Image
                        style={{ height: 30, width: 30 }}
                        resizeMode={'contain'}
                        source={require('../images/UI/endpoint/4x/Asset21_4x.png')}
                      />
                      <TextInput
                        style={{
                          flex: 8,
                          marginLeft: 5,
                          color: Colors.fontColor,
                          paddingVertical: 3,
                          fontSize: FontSize.medium,
                          borderBottomColor: Colors.borderColor,
                          borderBottomWidth: 0.7,
                        }}
                        secureTextEntry={data.secureTextEntry ? true : false}
                        keyboardType="default"

                        placeholderTextColor={Colors.backgroundColor}
                        placeholder={Language.t('login.password') + '..'}
                        value={password}
                        onChangeText={(val) => {
                          setPassword(val);
                        }}
                      />

                      <TouchableOpacity style={{ marginLeft: 10 }} onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? (
                          <FontAwesome
                            name="eye-slash"
                            size={25}
                            color={Colors.borderColor}
                          />
                        ) : (
                          <FontAwesome
                            name="eye"
                            size={25}
                            color={Colors.borderColor} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: 20, marginBottom:20, }}>
                  <TouchableNativeFeedback
                    onPress={() => _onPressAddbase()}>
                    <View
                      style={{
                        borderRadius: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: 50,
                       
                        backgroundColor: Colors.buttonColorPrimary,
                      }}>
                      <Text
                        style={{
                          color: Colors.buttonTextColor,
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold',
                        }}>
                        {Language.t('selectBase.saveandconnect')}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>

              </View>

            </KeyboardAvoidingView>

          </SafeAreaView>
        </ScrollView>
        {loading && (
          <View
            style={{
              width: deviceWidth,
              height: deviceHeight,
              opacity: 0.5,
              backgroundColor: Colors.backgroundColorSecondary,
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
    </View>
  )
}

const styles = StyleSheet.create({
  container1: {

    flex: 1,

  },
  body: {
    marginLeft: 20,
    marginRight: 20
  },
  body1e: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: 'flex-end'
  },
  body1: {
    marginTop: 10,
    flexDirection: "row",
  },
  tabbar: {
    height: 70,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',


    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    justifyContent: "center"
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
    color: Colors.fontColor,
  },
  imageIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    height: deviceHeight / 3,
    width: deviceWidth,

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
const mapStateToProps = (state) => {
  return {


  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    reduxMachineNum: (payload) => dispatch(registerActions.machine(payload)),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectBase);
