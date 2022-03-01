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
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  BackHandler,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { Picker, } from 'native-base';
import { useStateIfMounted } from 'use-state-if-mounted';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNRestart from 'react-native-restart';

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
import SearchableDropdown from 'react-native-searchable-dropdown';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var ser_die = true
import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';
import safe_Format from '../src/safe_Format';
import { fontWeight } from 'styled-system';
const AddbarSKUScreen = ({ route }) => {
  let arrayResult = [];

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
  const activeReducerUTQ = useSelector(({ activeReducerUTQ }) => activeReducerUTQ);

  const [selectedValue, setSelectedValue] = useState('');
  const [SKUScreenValue, setSKUScreenValue] = useState(databaseReducer.Data.nameser ? databaseReducer.Data.nameser : "-1");
  const [selectlanguage, setlanguage] = useState('thai');
  const [GOODS_CODE, setGOODS_CODE] = useState('');
  const [SKU_NAME, setSKU_NAME] = useState('');
  const [UTQ_NAME, setUTQ_NAME] = useState({});
  const [ARPLU_U_PRC, setARPLU_U_PRC] = useState('');
  const [onFocus, setonFocus] = useState(true);

  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);
  const [loading_backG, setLoading_backG] = useStateIfMounted(true);
  const [machineNo, setMachineNo] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [SKUMASTER, setSKUMASTER] = useState({});
  const [GOODSMASTER, setGOODSMASTER] = useState([]);
  const [isSFeatures, setSFeatures] = useState(loginReducer.isSFeatures == true ? '\"Y\"' : '\"N\"');
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
  const image = '../images/UI/SKU/4x/Asset22_4x.png';
  let clockCall = null;
  const defaultCountDown = -1;

  const [serverData, setServerData] = useState(activeReducerUTQ.UTQ);
  const [countdown, setCountdown] = useState(defaultCountDown);
  const [recon, setRecon] = useState('');
  let kye_token = "";

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  useEffect(() => {

  }, []);



  useEffect(() => {
    if (route.params?.post) {
      setGOODS_CODE(route.params.post)
    }
    if (route.params?.GOODSMASTER) {
      console.log(route.params.GOODSMASTER)
      setGOODSMASTER(route.params.GOODSMASTER)
      setSKUMASTER(route.params.SKUMASTER)
    }

  }, [route.params?.data]);

  const set_Focus = (onFocus) => {
    setonFocus(onFocus)

  }
  const set_UTQ = (txt) => {
    console.log(txt.toUpperCase())
    if (serverData.filter((item) => { return (item.name.toUpperCase() == txt.toUpperCase()) })[0])
      setUTQ_NAME(serverData.filter((item) => { return (item.name.toUpperCase() == txt.toUpperCase()) })[0])
    else setUTQ_NAME({})
  }

  const setSKU = () => {
    let c = true
    console.log(`GOODS_CODE ${GOODS_CODE}`)
    console.log(`UTQ_NAME ${UTQ_NAME.name}`)
    console.log(`ARPLU_U_PRC ${ARPLU_U_PRC}`)
    console.log(`UTQ_NAME.UTQ_QTY ${UTQ_NAME.UTQ_QTY}`)
    if (GOODS_CODE == '') c = false
    else if (!UTQ_NAME.name) c = false
    else if (ARPLU_U_PRC == '') c = false
    console.log(c)
    if (c) {
      let temp_GOODSMASTER = GOODSMASTER
      let jsonObj = {
        GOODS_KEY: GOODSMASTER[0].GOODS_KEY,
        GOODS_CODE: GOODS_CODE,
        GOODS_SKU: GOODSMASTER[0].GOODS_SKU,
        GOODS_PRICE: GOODSMASTER[0].GOODS_PRICE,
        GOODS_ALIAS: GOODSMASTER[0].GOODS_ALIAS,
        GOODS_E_ALIAS: GOODSMASTER[0].GOODS_E_ALIAS,
        GOODS_BARTYPE: GOODSMASTER[0].GOODS_BARTYPE,
        UTQ_NAME: UTQ_NAME.name,
        UTQ_QTY: UTQ_NAME.UTQ_QTY,
        Temp_ARPLU_U_PRC: ARPLU_U_PRC,
        onFocus: false,
        ARPLU_U_PRC: ARPLU_U_PRC,
        ARPLU_U_DSC: GOODSMASTER[0].ARPLU_U_DSC,
        TAG_CODE: GOODSMASTER[0].TAG_CODE,
        TAG_NAME: GOODSMASTER[0].TAG_NAME
      }
      console.log(jsonObj)
      console.log(GOODSMASTER)
      temp_GOODSMASTER.push(jsonObj)
      console.log(temp_GOODSMASTER)
      navigation.navigate('SKUScreen', { data: '', SKUMASTER: SKUMASTER, GOODSMASTER: GOODSMASTER })
    } else {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    }
  }

  return (
    <View style={container1}>
      <StatusBar hidden={true} />
      <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={styles.image}>
        {!loading_backG ? <>
          <View style={{ marginTop: 150 }}>

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

                placeholder={Language.t('main.goodscode') + '..'}

                onChangeText={(val) => {
                  setGOODS_CODE(val)
                }} />

              <TouchableOpacity style={{ padding: 10, }} onPress={() => navigation.navigate('Scanbarcode', { route: 'AddbarSKUScreen', data: 'go' })}>
                <FontAwesome name="barcode" style={{ color: Colors.loadingColor, }} size={FontSize.large} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: deviceHeight / 10 }}>
            <SafeAreaView >
              <KeyboardAvoidingView >
                <View style={styles.body}>

                  <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                    <TextInput
                      style={{
                        width: 80,
                        color: 'black'

                      }}
                      editable={false}
                      value={Language.t('trading.productUnit') + ' : '}
                    />
                    <View style={{ marginTop: 10, padding: 10, flex: 8, backgroundColor: '#fff', justifyContent: 'center', borderRadius: 20, }}>
                      <SearchableDropdown
                        items={serverData}
                        placeholder={UTQ_NAME.name ? UTQ_NAME.name : Language.t('trading.productUnit') + '..'}
                        placeholderTextColor={'black'}
                        onBlur={() => !UTQ_NAME.name && (Alert.alert(
                          Language.t('alert.errorTitle'),
                          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]))}
                        onTextChange={(text) => set_UTQ(text)}
                        onItemSelect={(item) => setUTQ_NAME(item)}
                        selectedItems={UTQ_NAME}
                        textInputStyle={{
                          borderBottomColor: Colors.borderColor,
                          borderBottomWidth: 1,
                          color: 'black',
                          fontSize: FontSize.medium,
                        }}
                        itemStyle={{
                          marginTop: 2,
                          color: 'black',
                          fontSize: FontSize.medium,
                        }}
                        itemsContainerStyle={{
                          maxHeight: 100,
                        }}
                        itemTextStyle={{
                          color: '#222',
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                    <TextInput
                      style={{
                        width: 80,
                        color: 'black'

                      }}
                      editable={false}
                      value={Language.t('trading.prodPrice') + ' : '}
                    />

                    <View style={{ marginTop: 10, padding: 10, flex: 8, backgroundColor: '#fff', justifyContent: 'center', borderRadius: 20, }}>
                      {onFocus == true ? <>
                        <TextInput
                          style={{
                            borderBottomColor: Colors.borderColor,
                            borderBottomWidth: 1,
                            color: Colors.fontColor,
                            fontSize: FontSize.medium,
                          }}
                          keyboardType="number-pad"
                          placeholderTextColor={Colors.fontColorSecondary}
                          value={ARPLU_U_PRC}
                          multiline={true}
                          textAlign={'right'}
                          placeholder={Language.t('trading.prodPrice') + '..'}
                          onBlur={() => set_Focus(false)}
                          onSubmitEditing={() => set_Focus(false)}
                          onChangeText={(val) => {
                            setARPLU_U_PRC(val)
                          }}
                        />
                      </> : <>
                        < TouchableOpacity

                          onPress={() => {
                            set_Focus(true)
                          }}>
                          <CurrencyInput
                            style={{
                              borderBottomColor: Colors.borderColor,
                              borderBottomWidth: 1,
                              color: Colors.fontColor,
                              fontSize: FontSize.medium,
                            }}
                            editable={false}
                            delimiter=","
                            separator="."
                            precision={2}
                            keyboardType="number-pad"
                            placeholderTextColor={Colors.fontColorSecondary}
                            value={ARPLU_U_PRC}
                            multiline={true}
                            textAlign={'right'}
                            placeholder={Language.t('trading.prodPrice') + '..'}
                            onSubmitEditing={() => set_Focus(true)}
                            onPress={() => {
                              set_Focus(true)
                            }}
                          />
                        </TouchableOpacity>
                      </>}

                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>

          <View style={styles.footer}>
            <View></View>
            <TouchableOpacity style={{ padding: 10, width: deviceWidth / 3, }} onPress={() => Alert.alert('', Language.t('trading.addTrading'), [{ text: Language.t('alert.ok'), onPress: () => setSKU() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}>
              <View style={{ margin: 10, padding: 10, flexDirection: "row", justifyContent: 'center', backgroundColor: Colors.loadingColor, borderRadius: 10, }}>
                <Text style={{ color: Colors.backgroundLoginColorSecondary, fontSize: FontSize.medium, }}>{Language.t('alert.add')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 10, width: deviceWidth / 3, }} onPress={() => Alert.alert('', Language.t('menu.alertunsaveMessage'), [{ text: Language.t('alert.ok'), onPress: () => navigation.goBack() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}>
              <View style={{ margin: 10, padding: 10, flexDirection: "row", justifyContent: 'center', backgroundColor: 'red', borderRadius: 10, }}>
                <Text style={{ color: Colors.backgroundLoginColorSecondary, fontSize: FontSize.medium, }}>{Language.t('alert.cancel')}</Text>
              </View>
            </TouchableOpacity>
            <View></View>
          </View>
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
    flexDirection: 'column',
  },
  body: {
    margin: 10,
    marginBottom: 60,
    borderRadius: 15,
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

    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  footer: {
    position: 'absolute',

    justifyContent: 'center',
    flexDirection: "row",
    height: 80,
    left: 0,
    top: deviceHeight - 80,
    width: deviceWidth,
  },
  table: {

  },
  tableView: {


    paddingLeft: 10,
    paddingRight: 10,

    flexDirection: "row",

  },
  tableHeader: {
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
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
  image: {
    flex: 1,
    justifyContent: "center"
  },
  topImage: {
    height: deviceHeight / 3,
    width: deviceWidth,

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
export default connect(mapStateToProps, mapDispatchToProps)(AddbarSKUScreen);
