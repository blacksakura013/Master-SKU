import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Text,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
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
// import { View } from 'react-native-paper';
import Dialog from 'react-native-dialog';
import { Language } from '../translations/I18n';
import DeviceInfo from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var ser_die = true
import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';
import safe_Format from '../src/safe_Format';
const SKUScreen = ({ route }) => {
  let arrayResult = [];
  const serviceID = "{167f0c96-86fd-488f-94d1-cc3169d60b1a}"
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
  const [SKUScreenValue, setSKUScreenValue] = useState(databaseReducer.Data.nameser ? databaseReducer.Data.nameser : "-1");
  const [selectlanguage, setlanguage] = useState('thai');
  const [GOODS_CODE, setGOODS_CODE] = useState('');
  const [Temp_report, setTemp_report] = useState('');


  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);

  const [machineNo, setMachineNo] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [arrayObj, setArrayObj] = useState([]);
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });

  let kye_token = "";
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  useEffect(() => {
    console.log('>> Address :', loginReducer.ipAddress)
  }, []);
  useEffect(() => {
    console.log('>> arrayObj :', arrayObj)
    arrayObj.map((item) => {
      console.log(item.GOODS_CODE)
    })
  }, [arrayObj]);

  useEffect(() => {
    if (route.params?.post) {
      setGOODS_CODE(route.params.post)
      fetchBarcodeData(route.params.post)
    }


  }, [route.params?.post]);
  const on_cancel = () => {
    setGOODS_CODE('')
    setTemp_report('')
    setArrayObj([])
  }

  const regisMacAdd = async () => {
    let tempGuid = await safe_Format._fetchGuidLog(databaseReducer.Data.urlser, loginReducer.serviceID, registerReducer.machineNum, loginReducer.userNameED, loginReducer.passwordED)
    await dispatch(loginActions.guid(tempGuid))
    fetchData(tempGuid)
  };

  const logOut = async () => {
    await fetch(loginReducer.ipAddress[0].urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'UnRegister',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "' +
          loginReducer.ipAddress[0].usernameser +
          '","BPAPUS-PASSWORD": "' +
          loginReducer.ipAddress[0].passwordser +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "' +
          loginReducer.userName +
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
          navigation.dispatch(
            navigation.replace('LoginStackScreen')
          )
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
          );
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        if (loginReducer.ipAddress[0].urlser == '') {
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

  const fetchBarcodeData = async (fetchBarcodeData) => {
    setLoading(true)
    setTemp_report('')
    console.log('hit >> ', fetchBarcodeData)
    await fetch(databaseReducer.Data.urlser + '/SetupErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GETSKUINFOBYGOODSCODE',
        'BPAPUS-PARAM':
          '{"GOODS_CODE": "' +
          fetchBarcodeData + '"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);

        if (responseData.RECORD_COUNT > 0) {
          console.log(responseData.DOCINFO)
          setTemp_report(responseData.DOCINFO.SKU_NAME);
          setArrayObj(responseData.GOODSMASTER)
        } else {
          setTemp_report('ไม่พบข้อมูล');
          Alert.alert("ไม่พบข้อมูล");
        }
        setLoading(false)
      })
      .catch((error) => {
        if (ser_die) {
          ser_die = false
          regisMacAdd()
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + 610;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{
              text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
                navigation.replace('LoginStackScreen')
              )
            }]);
          setLoading(false)
        }
        console.error('ERROR at fetchContent >> ' + error)
      })

  }

  const fetchData = async (tempGuid) => {
    setLoading(true)
    setTemp_report('')
    console.log('hit >> ', GOODS_CODE)  
    await fetch(databaseReducer.Data.urlser + '/SetupErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': tempGuid ? tempGuid : loginReducer.guid,
        'BPAPUS-FUNCTION': 'GETSKUINFOBYGOODSCODE',
        'BPAPUS-PARAM':
          '{"GOODS_CODE": "' +
          GOODS_CODE + '"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);

        if (responseData.RECORD_COUNT > 0) {
          console.log(responseData.DOCINFO)
          setTemp_report(responseData.DOCINFO.SKU_NAME);


          setArrayObj(responseData.GOODSMASTER)



        } else {
          setTemp_report('ไม่พบข้อมูล');
          Alert.alert("ไม่พบข้อมูล");
        }

        setLoading(false)
      })
      .catch((error) => {
        if (ser_die) {
          ser_die = false
          regisMacAdd()
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + 610;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{
              text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
                navigation.replace('LoginStackScreen')
              )
            }]);
          setLoading(false)
        }
        console.error('ERROR at fetchContent >> ' + error)
      })

  }



  return (
    <View style={container1}>
      <StatusBar hidden={true} />
      <View style={{ marginTop: 10 }}>

      </View>
      <View style={tabbar} >
        <View style={{
          backgroundColor: '#fff', alignSelf: 'center',
          justifyContent: 'center', borderRadius: 20, flexDirection: 'row', marginBottom: 10
        }}>

          <TextInput
            style={{
              flex: 8,
              marginLeft: 10,
              borderBottomColor: Colors.borderColor,
              color: Colors.fontColor,
              padding: 10,
              fontSize: FontSize.medium,

            }}
            keyboardType="number-pad"
            placeholderTextColor={Colors.fontColorSecondary}
            value={GOODS_CODE}

            placeholder={'รหัสสินค้า'}
            onSubmitEditing={() => fetchData()}
            onChangeText={(val) => {
              setGOODS_CODE(val)
            }} />

          <TouchableOpacity style={{ padding: 10, }} onPress={() => fetchData()}>
            <FontAwesome name="search" color={'black'} size={30} />
          </TouchableOpacity>

        </View>
      </View>
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <View style={{
          backgroundColor: '#fff', alignSelf: 'center',
          justifyContent: 'center', borderRadius: 20, flexDirection: 'row', marginBottom: 10,
        }}>
          <Text
            style={{
              flex: 8,
              marginLeft: 10,
              borderBottomColor: Colors.borderColor,
              color: Colors.fontColor,
              padding: 40,
              fontSize: 30,
              textAlign: 'center'
            }}
          >
            {Temp_report ? Temp_report : null}
          </Text>
        </View>
      </View>

      <ScrollView>
        <SafeAreaView >

          <KeyboardAvoidingView >
            <View style={styles.body}>
              <View
                style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={{ flex: 0.5 }}  >
                    <Text style={{
                      fontSize: FontSize.medium,
                      color: Colors.fontColor2
                    }}> รหัส</Text></View>
                  <View style={{ flex: 0.3, }}  >
                    <Text style={{
                      fontSize: FontSize.medium,
                      color: Colors.fontColor2
                    }}>หน่วย</Text></View>
                  <View style={{ flex: 0.3 }} >
                    <Text style={{
                      fontSize: FontSize.medium,
                      color: Colors.fontColor2,

                    }}> ราคา(บาท) </Text></View>
                </View>
                <ScrollView>
                  <KeyboardAvoidingView keyboardVerticalOffset={1} >
                    <TouchableNativeFeedback >
                      {arrayObj.length <= 0 ? (
                        <>
                          <View style={styles.tableView}>

                            <TextInput
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}

                            />


                          </View>
                          <View style={styles.tableView}>

                            <TextInput
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}

                            />


                          </View>
                          <View style={styles.tableView}>

                            <TextInput
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}

                            />


                          </View>
                          <View style={styles.tableView}>

                            <TextInput
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}

                            />


                          </View>
                          <View style={styles.tableView}>

                            <TextInput
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}

                            />


                          </View>
                        </>) : (<>
                          {arrayObj.map((item) => {
                            return (
                              <View style={styles.tableView}>
                                <TextInput
                                  style={{
                                    color: Colors.fontColor,
                                    fontSize: FontSize.medium,
                                    flex: 0.5
                                  }}
                                  multiline={true}
                                  editable={false}
                                  placeholderTextColor={Colors.fontColorSecondary}
                                  value={item.GOODS_CODE}

                                  placeholder={'รหัสสินค้า'}

                                />
                                <TextInput
                                  style={{
                                    color: Colors.fontColor,
                                    fontSize: FontSize.medium,
                                    flex: 0.3
                                  }}
                                  multiline={true}
                                  editable={false}
                                  placeholderTextColor={Colors.fontColorSecondary}
                                  value={item.UTQ_NAME}

                                  placeholder={'รหัสสินค้า'}
                                />
                                <View style={{
                                  color: Colors.fontColor,
                                  fontSize: FontSize.medium,
                                  borderRadius: 10,
                                  padding: 1,
                                  backgroundColor: Colors.buttonColorPrimary,
                                  flex: 0.3,
                                }}>
                                  <TextInput
                                    style={{
                                      color: Colors.fontColor,
                                      fontSize: FontSize.medium,
                                      borderRadius: 10,
                                      backgroundColor: Colors.fontColor2,
                                      flex: 0.3,
                                    }}
                                    keyboardType="number-pad"
                                    placeholderTextColor={Colors.fontColorSecondary}
                                    value={item.ARPLU_U_PRC}
                                    multiline={true}
                                    textAlign={'center'}
                                    placeholder={'ราคาสินค้า'}
                                    onSubmitEditing={() => fetchData()}
                                    onChangeText={(val) => {

                                    }} />
                                </View>

                              </View>
                            )

                          })}

                        </>)}


                    </TouchableNativeFeedback>
                  </KeyboardAvoidingView>
                </ScrollView>

              </View>
            </View>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </ScrollView>
      <View style={styles.footer}>
        <View></View>
        <TouchableOpacity style={{ padding: 10, }} onPress={() => Alert.alert('', Language.t('menu.alertLogoutMessage'), [{ text: Language.t('alert.ok'), onPress: () => logOut() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}>
          <Image
            source={
              require('../images/iconsMenu/power-on.png')
            }
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, }} onPress={() => fetchData()}>
          <TouchableNativeFeedback
            onPress={() => fetchData()}>
            <View
              style={{
                borderRadius: 10,
                flexDirection: 'column',
                padding: 5,
                backgroundColor: 'green',
              }}>
              <Text
                style={{
                  color: Colors.fontColor2,
                  alignSelf: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                บัททึก
              </Text>
            </View>
          </TouchableNativeFeedback>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, }} onPress={() => on_cancel()}>
          <TouchableNativeFeedback
            onPress={() => { }}>
            <View
              style={{
                borderRadius: 10,
                flexDirection: 'column',
                padding: 5,
                backgroundColor: 'red',
              }}>
              <Text
                style={{
                  color: Colors.fontColor2,
                  alignSelf: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                ยกเลิก
              </Text>
            </View>
          </TouchableNativeFeedback>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, }} onPress={() => navigation.navigate('Scanbarcode', { route: 'SKUScreen' })}>
          <FontAwesome name="barcode" color={'black'} size={30} />
        </TouchableOpacity>
        <View></View>
      </View>

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
    </View>
  )
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundLoginColor,
    flex: 1,
    flexDirection: 'column',
  },
  body: {
    margin: 10,
    marginBottom: 60,
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.fontColor2
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
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: Colors.backgroundLoginColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  footer: {
    position: 'absolute',
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    flexDirection: "row",
    height: 60,
    left: 0,
    top: deviceHeight - 60,
    width: deviceWidth,
  },
  table: {


  },
  tableView: {


    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    flexDirection: "row",

  },
  tableHeader: {
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
    backgroundColor: Colors.buttonColorPrimary,

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
const mapStateToProps = (state) => {
  return {


  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    reduxMachineNum: (payload) => dispatch(registerActions.machine(payload)),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SKUScreen);
