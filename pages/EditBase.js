import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Text,
  Platform,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
 
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';

import { useStateIfMounted } from 'use-state-if-mounted';
import { SafeAreaView } from 'react-native-safe-area-context';




import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../src/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FontSize } from '../components/FontSizeHelper';
import { useNavigation } from '@react-navigation/native';
import { Language } from '../translations/I18n';

import * as loginActions from '../src/actions/loginActions';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';
import { Col } from 'antd';

const EditBase = ({ route }) => {

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
  const [selectbaseValue, setSelectbaseValue] = useState('');
  const [basename, setBasename] = useState('');
  const [baseurl, setBsaeurl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);
  const [loading_backG, setLoading_backG] = useStateIfMounted(true);
  const [machineNo, setMachineNo] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [updateindex, setUpdateindex] = useState(null)
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });

  const image = '../images/UI/endpoint/4x/Asset12_4x.png';

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  var a = 0
  useEffect(() => {
    
     
  }, [])

  useEffect(() => {
    setLoading(true)
    console.log(route.params.data)
    console.log(route.params.selectbaseValue)
    for (let i in loginReducer.ipAddress) {
      if (loginReducer.ipAddress[i].nameser == route.params.selectbaseValue) {
        setBasename(loginReducer.ipAddress[i].nameser)
        setBsaeurl(loginReducer.ipAddress[i].urlser)
        setUsername(loginReducer.ipAddress[i].usernameser)
        setPassword(loginReducer.ipAddress[i].passwordser)
        setUpdateindex(i)
      }
    }
    setLoading(false)

  }, [route.params?.data]);
  useEffect(() => {
    setLoading(true)
    console.log('length>>', loginReducer.ipAddress.length)
    if (route.params?.selectbaseValue  ) {
      
      for (let i in loginReducer.ipAddress) {
        if (loginReducer.ipAddress[i].nameser == route.params.selectbaseValue) {
          setBasename(loginReducer.ipAddress[i].nameser)
          setBsaeurl(loginReducer.ipAddress[i].urlser)
          setUsername(loginReducer.ipAddress[i].usernameser)
          setPassword(loginReducer.ipAddress[i].passwordser)
          setUpdateindex(i)
        }
      }
    }
    setLoading(false)

  }, [route.params?.selectbaseValue  ]);
  useEffect(() => {

    console.log('\n', registerReducer.machineNum)
    for (let i in loginReducer) {
      console.log(loginReducer[i])
    }
  }, [registerReducer.machineNum]);


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
  const _onPressUpdate = async () => {
    setLoading(true)
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    if (checkValue() == true) {
      let temp = []
      let check = false;


      for (let i in loginReducer.ipAddress) {
        if (i != updateindex) {

          if (
            loginReducer.ipAddress[i].urlser == newurl || loginReducer.ipAddress[i].nameser == basename
          ) {
            console.log(loginReducer.ipAddress[i].urlser, ' == ', newurl, ' || ', loginReducer.ipAddress[i].nameser, ' == ', basename)
            Alert.alert('', Language.t('selectBase.Alert'), [{ text: Language.t('alert.ok'), onPress: () => setLoading(false) }]);
            check = true;

            break;
          }
        }
      }
      console.log(check)
      if (!check) {
        await checkIPAddress()
      }


    }
  }
  const _onPressDelete = async () => {
    setLoading(true)

    let temp = loginReducer.ipAddress;
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    if (baseurl == databaseReducer.Data.urlser) {
      Alert.alert('', Language.t('selectBase.cannotDelete'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else {
      if (temp.length == 1) {
        Alert.alert('', Language.t('selectBase.cannotDelete'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      } else {
        for (let i in loginReducer.ipAddress) {
          if (loginReducer.ipAddress[i].urlser == baseurl) {
            Alert.alert('', Language.t('selectBase.questionDelete'), [{
              text: Language.t('alert.ok'), onPress: () => {
                temp.splice(i, 1);
                setLoading(false)
                navigation.dispatch(
                  navigation.replace('SelectScreen', { data: a })
                )
              }
            }, { text: Language.t('alert.cancel'), onPress: () => console.log('cancel Pressed') }]);
            break;
          }
        }
      }
    }

    dispatch(loginActions.ipAddress(temp));

    setLoading(false)

  }




  const checkIPAddress = async () => {

    let temp = [];
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    await fetch(baseurl + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{ "BPAPUS-MACHINE": "11111122","BPAPUS-CNTRY-CODE": "66", "BPAPUS-MOBILE": "0828845662"}'
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
                dispatch(loginActions.ipAddress([]))
                let newObj = {
                  nameser: basename,
                  urlser: newurl,
                  usernameser: username,
                  passwordser: password
                }
                console.log(json.ResponseCode)
                for (let i in loginReducer.ipAddress) {
                  if (i == updateindex) {
                    temp.push(newObj)
                  } else {
                    temp.push(loginReducer.ipAddress[i])
                  }
                }
                dispatch(loginActions.ipAddress(temp))
                dispatch(databaseActions.setData(newObj))

                navigation.dispatch(
                  navigation.replace('SelectScreen', { data: a })
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
              Alert.alert(
                Language.t('alert.errorTitle'),
                Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
              console.error('_fetchGuidLogin ' + error);
            });
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
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        console.log('checkIPAddress');
        setLoading(false)
      });

  };

  return (
    <View style={container1}>

      <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={styles.image}>
        {!loading_backG ? <>
          <ImageBackground source={require('../images/UI/endpoint/4x/Asset13_4x.png')} resizeMode="cover" style={topImage}>
            <View style={tabbar}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" color={Colors.backgroundLoginColorSecondary} size={FontSize.large} />
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 12,
                    fontSize: FontSize.medium,
                    color: Colors.backgroundLoginColorSecondary,
                  }}> {Language.t('selectBase.editheader')} </Text>
              </View>
              <View>

              </View>
            </View>
          </ImageBackground>
          <ScrollView>
            <SafeAreaView >
              <View style={styles.body}>
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
                      <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('ScanScreen', { route: 'EditBase' })}>

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


                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View style={{ marginTop: 20, width: deviceWidth / 2.2 }}>
                    <TouchableNativeFeedback
                      onPress={() => _onPressUpdate()}>
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
                          {Language.t('selectBase.edit')}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>


                  <View style={{ marginTop: 20, width: deviceWidth / 2.2 }}>
                    <TouchableNativeFeedback
                      onPress={() => _onPressDelete()}>
                      <View
                        style={{
                          borderRadius: 10,
                          flexDirection: 'column',
                          justifyContent: 'center',
                          height: 50,
                          backgroundColor: Colors.backgroundLoginColor,
                        }}>
                        <Text
                          style={{
                            color: Colors.backgroundColorSecondary,
                            alignSelf: 'center',
                            fontSize: FontSize.medium,
                            fontWeight: 'bold',
                          }}>
                          {Language.t('selectBase.delete')}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </> : <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            opacity: 0.5,
            backgroundColor: Colors.backgroundLoginColorSecondary,
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
          }}>
          {/* <ActivityIndicator
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
            /> */}
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

    machineNum: state.registerReducer.machineNum,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    reduxMachineNum: (payload) => dispatch(registerActions.machine(payload)),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditBase);
