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

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var ser_die = true
import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';
import safe_Format from '../src/safe_Format';
import { fontWeight, height, margin } from 'styled-system';
const SKUScreen = ({ route }) => {
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

  const [selectedValue, setSelectedValue] = useState('');
  const [SKUScreenValue, setSKUScreenValue] = useState(databaseReducer.Data.nameser ? databaseReducer.Data.nameser : "-1");
  const [selectlanguage, setlanguage] = useState('thai');
  const [GOODS_CODE, setGOODS_CODE] = useState('');
  const [Temp_report, setTemp_report] = useState('');

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

  const [countdown, setCountdown] = useState(defaultCountDown);
  const [recon, setRecon] = useState('');
  let kye_token = "";
  useEffect(() => {
    const backAction = () => {
      Alert.alert(Language.t('menu.exitProgram'), Language.t('menu.DoexitProgram'), [
        {
          text: Language.t('alert.cancel'),
          onPress: () => null,
          style: "cancel"
        },
        { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  useEffect(() => {
    console.log('>> Address : ', loginReducer.ipAddress)
    console.log('>> isSFeatures : ', loginReducer.isSFeatures, isSFeatures)
    console.log(`>> loginReducer.endpointMother ${loginReducer.endpointMother}`)
  }, []);

  useEffect(() => {

    if (route.params.post) {
      setGOODS_CODE(route.params.post)
      fetchBarcodeData(route.params.post)
    }
    if (route.params?.GOODSMASTER) {
      for (var i in route.params.GOODSMASTER)
        console.log(`GOODSMASTER >> ${route.params.GOODSMASTER[i]}`)
      // route.params.GOODSMASTER.map((item) => {
      //   return console.log(`GOODSMASTER >> ${item}`)
      // })



      setGOODSMASTER(route.params.GOODSMASTER)
    }
    if (route.params?.SKUMASTER) {

      console.log(`SKUMASTER >> ${route.params.SKUMASTER.UTQ_S_NAME}`)

      setSKUMASTER(route.params.SKUMASTER)
      setTemp_report(route.params.SKUMASTER.SKU_NAME)
      setGOODS_CODE(route.params.SKUMASTER.SKU_CODE)
    }
    if (route.params?.data && route.params.data == 'on_cancel') {
      on_cancel()
    }



  }, [route.params?.data]);

  const decrementClock = () => {
    if (countdown === 0) {

      setCountdown(0);
      clearInterval(clockCall);
    } else {
      setCountdown(countdown - 1);
    }
  };
  const on_scan = () => {
    on_cancel()
    navigation.navigate('Scanbarcode', { route: 'SKUScreen', data: 'go' })
  }
  const on_cancel = () => {
    setGOODS_CODE('')
    setTemp_report('')
    setGOODSMASTER([])
  }

  useEffect(() => {
    if (countdown === 0) {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('selectBase.UnableConnec'), [{ text: Language.t('selectBase.connectAgain'), onPress: () => connectAgain() }, { text: Language.t('main.cancel'), onPress: () => BackHandler.exitApp() }]);
    }
    console.log(countdown)
  }, [countdown])
  const connectAgain = () => {
    if (recon == 'pushData') pushData()
    else if (recon == 'fetchBarcodeData') fetchBarcodeData()
    else if (recon == 'fetchMotherData') fetchMotherData()
    else if (recon == 'logOut') logOut()
    else setLoading(false)

  }
  const dieSer = (fn) => {
    setRecon(fn)
    setCountdown(15)
    // clockCall = setInterval(() => {
    //   decrementClock();
    // }, 1000);

  }
  // const _PressResend = () => {

  //   setCountdown(defaultCountDown);

  //   clearInterval(clockCall);
  //   clockCall = setInterval(() => {
  //     decrementClock();
  //   }, 1000);
  // }
  useEffect(() => {
    if (countdown != -1) {
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);
      return () => {
        clearInterval(clockCall);
      };
    }
  });

  const set_Focus = (GOODS_CODE, onFocus) => {
    console.log(GOODS_CODE, ' >>   ', onFocus)
    let temp_array = [];
    for (var i in GOODSMASTER) {
      if (GOODSMASTER[i].GOODS_CODE == GOODS_CODE) {
        let jsonObj = {
          GOODS_KEY: GOODSMASTER[i].GOODS_KEY,
          GOODS_CODE: GOODSMASTER[i].GOODS_CODE,
          GOODS_SKU: GOODSMASTER[i].GOODS_SKU,
          GOODS_PRICE: GOODSMASTER[i].GOODS_PRICE,
          GOODS_ALIAS: GOODSMASTER[i].GOODS_ALIAS,
          GOODS_E_ALIAS: GOODSMASTER[i].GOODS_E_ALIAS,
          GOODS_BARTYPE: GOODSMASTER[i].GOODS_BARTYPE,
          UTQ_NAME: GOODSMASTER[i].UTQ_NAME,
          UTQ_QTY: GOODSMASTER[i].UTQ_QTY,
          Temp_ARPLU_U_PRC: GOODSMASTER[i].Temp_ARPLU_U_PRC,
          onFocus: onFocus,
          ARPLU_U_PRC: GOODSMASTER[i].ARPLU_U_PRC,
          ARPLU_U_DSC: GOODSMASTER[i].ARPLU_U_DSC,
          TAG_CODE: GOODSMASTER[i].TAG_CODE,
          TAG_NAME: GOODSMASTER[i].TAG_NAME
        }
        temp_array.push(jsonObj)
      } else {
        temp_array.push(GOODSMASTER[i])
      }
      console.log(GOODSMASTER[i].GOODS_CODE)
    }

    setGOODSMASTER(temp_array)
    console.log(temp_array)
  }
  const set_SkuP = (GOODS_CODE, ARPLU_U_PRC) => {
    console.log(GOODS_CODE, ' >>   ', ARPLU_U_PRC)
    let temp_array = [];
    for (var i in GOODSMASTER) {
      if (GOODSMASTER[i].GOODS_CODE == GOODS_CODE) {
        let jsonObj = {
          GOODS_KEY: GOODSMASTER[i].GOODS_KEY,
          GOODS_CODE: GOODSMASTER[i].GOODS_CODE,
          GOODS_SKU: GOODSMASTER[i].GOODS_SKU,
          GOODS_PRICE: GOODSMASTER[i].GOODS_PRICE,
          GOODS_ALIAS: GOODSMASTER[i].GOODS_ALIAS,
          GOODS_E_ALIAS: GOODSMASTER[i].GOODS_E_ALIAS,
          GOODS_BARTYPE: GOODSMASTER[i].GOODS_BARTYPE,
          UTQ_NAME: GOODSMASTER[i].UTQ_NAME,
          UTQ_QTY: GOODSMASTER[i].UTQ_QTY,
          Temp_ARPLU_U_PRC: GOODSMASTER[i].Temp_ARPLU_U_PRC,
          onFocus: true,
          ARPLU_U_PRC: ARPLU_U_PRC,
          ARPLU_U_DSC: GOODSMASTER[i].ARPLU_U_DSC,
          TAG_CODE: GOODSMASTER[i].TAG_CODE,
          TAG_NAME: GOODSMASTER[i].TAG_NAME
        }
        temp_array.push(jsonObj)
      } else {
        temp_array.push(GOODSMASTER[i])
      }
      console.log(GOODSMASTER[i].GOODS_CODE)
    }

    setGOODSMASTER(temp_array)
    console.log(temp_array)
  }

  const regisMacAdd = async (urlser, serviceID, machineNum, userNameED, passwordED) => {
    console.log(serviceID)
    let tempGuid = await safe_Format._fetchGuidLog(urlser, serviceID, machineNum, userNameED, passwordED)
    await dispatch(loginActions.guid(tempGuid))
    fetchMotherData(tempGuid)
  };

  const AddNewData = (fetchBarcodeData) => {
    Alert.alert(
      Language.t('alert.errorDetail'),
      Language.t('menu.alertsaveMessage'), [{ text: Language.t('alert.add'), onPress: () => navigation.navigate('NewSKUScreen', { post: fetchBarcodeData ? fetchBarcodeData : GOODS_CODE, data: GOODSMASTER }) }, { text: Language.t('alert.cancel'), onPress: () => console.log('cancel Pressed') }]);
  }

  const logOut = async () => {
    setLoading(true)
    dieSer('logOut')
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
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
        setLoading(false)
        if (json && json.ResponseCode == '635') {

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
        setCountdown(-1)
      }
      )
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
      });
  };

  const fetchBarcodeData = async (fetchBarcodeData) => {
    dieSer('fetchBarcodeData')
    setLoading(true)
    setTemp_report('')
    console.log('hit >> ', fetchBarcodeData)
    await fetch(loginReducer.endpointMother + '/SetupErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guidEndPoint,
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
          let newSkuobj = {
            SKU_KEY: responseData.DOCINFO.SKU_KEY ? responseData.DOCINFO.SKU_KEY : '',
            SKU_CODE: responseData.DOCINFO.SKU_CODE ? responseData.DOCINFO.SKU_CODE : '',
            SKU_NAME: responseData.DOCINFO.SKU_NAME ? responseData.DOCINFO.SKU_NAME : '',
            SKU_E_NAME: responseData.DOCINFO.SKU_E_NAME ? responseData.DOCINFO.SKU_E_NAME : '',
            SKU_BARCODE: responseData.DOCINFO.SKU_BARCODE ? responseData.DOCINFO.SKU_BARCODE : '',

            SKU_VAT_TY: responseData.DOCINFO.SKU_VAT_TY ? responseData.DOCINFO.SKU_VAT_TY : 3,
            SKU_VAT: responseData.DOCINFO.SKU_VAT ? responseData.DOCINFO.SKU_VAT : '',
            SKU_COST_TY: responseData.DOCINFO.SKU_COST_TY ? responseData.DOCINFO.SKU_COST_TY : 2,
            SKU_STOCK: responseData.DOCINFO.SKU_STOCK ? responseData.DOCINFO.SKU_STOCK : 1,
            SKU_SENSITIVITY: responseData.DOCINFO.SKU_SENSITIVITY ? responseData.DOCINFO.SKU_SENSITIVITY : 0,

            UTQ_K_NAME: responseData.DOCINFO.UTQ_K_NAME ? responseData.DOCINFO.UTQ_K_NAME : '',
            UTQ_K_QTY: responseData.DOCINFO.UTQ_K_QTY ? responseData.DOCINFO.UTQ_K_QTY : '',
            UTQ_T_NAME: responseData.DOCINFO.UTQ_T_NAME ? responseData.DOCINFO.UTQ_T_NAME : '',
            UTQ_T_QTY: responseData.DOCINFO.UTQ_T_QTY ? responseData.DOCINFO.UTQ_T_QTY : '',
            UTQ_S_NAME: responseData.DOCINFO.UTQ_S_NAME ? responseData.DOCINFO.UTQ_S_NAME : '',
            UTQ_S_QTY: responseData.DOCINFO.UTQ_S_QTY ? responseData.DOCINFO.UTQ_S_QTY : '',

            BRN_CODE: responseData.DOCINFO.BRN_CODE ? responseData.DOCINFO.BRN_CODE : '',
            BRN_NAME: responseData.DOCINFO.BRN_NAME ? responseData.DOCINFO.BRN_NAME : '',

            ICCAT_CODE: responseData.DOCINFO.ICCAT_CODE ? responseData.DOCINFO.ICCAT_CODE : '',
            ICCAT_NAME: responseData.DOCINFO.ICCAT_NAME ? responseData.DOCINFO.ICCAT_NAME : '',
            ICDEPT_CODE: responseData.DOCINFO.ICDEPT_CODE ? responseData.DOCINFO.ICDEPT_CODE : '',
            ICDEPT_THAIDESC: responseData.DOCINFO.ICDEPT_THAIDESC ? responseData.DOCINFO.ICDEPT_THAIDESC : '',
            ICDEPT_ENGDESC: responseData.DOCINFO.ICDEPT_ENGDESC ? responseData.DOCINFO.ICDEPT_ENGDESC : '',

            SKUALT_CODE: responseData.DOCINFO.SKUALT_CODE ? responseData.DOCINFO.SKUALT_CODE : '',
            SKUALT_NAME: responseData.DOCINFO.SKUALT_NAME ? responseData.DOCINFO.SKUALT_NAME : '',

            ICCOLOR_CODE: responseData.DOCINFO.ICCOLOR_CODE ? responseData.DOCINFO.ICCOLOR_CODE : '',
            ICCOLOR_NAME: responseData.DOCINFO.ICCOLOR_NAME ? responseData.DOCINFO.ICCOLOR_NAME : '',
            ICSIZE_CODE: responseData.DOCINFO.ICSIZE_CODE ? responseData.DOCINFO.ICSIZE_CODE : '',
            ICSIZE_NAME: responseData.DOCINFO.ICSIZE_NAME ? responseData.DOCINFO.ICSIZE_NAME : '',
            ICGL_CODE: responseData.DOCINFO.ICGL_CODE ? responseData.DOCINFO.ICGL_CODE : '',
            ICGL_NAME: responseData.DOCINFO.ICGL_NAME ? responseData.DOCINFO.ICGL_NAME : '',
            ICPRT_CODE: responseData.DOCINFO.ICPRT_CODE ? responseData.DOCINFO.ICPRT_CODE : '',
            ICPRT_NAME: responseData.DOCINFO.ICPRT_NAME ? responseData.DOCINFO.ICPRT_NAME : '',

            WL_CODE: responseData.DOCINFO.WL_CODE ? responseData.DOCINFO.WL_CODE : '',
            WL_NAME: responseData.DOCINFO.WL_NAME ? responseData.DOCINFO.WL_NAME : '',

            SKU_PROPERTIES: isSFeatures
          }
          console.log(newSkuobj)

          let temp_GoodData = [];
          for (var i in responseData.GOODSMASTER) {
            let newGoodobj = {
              GOODS_KEY: responseData.GOODSMASTER[i].GOODS_KEY ? responseData.GOODSMASTER[i].GOODS_KEY : '',
              GOODS_CODE: responseData.GOODSMASTER[i].GOODS_CODE ? responseData.GOODSMASTER[i].GOODS_CODE : '',
              GOODS_SKU: responseData.GOODSMASTER[i].GOODS_SKU ? responseData.GOODSMASTER[i].GOODS_SKU : '',
              GOODS_PRICE: responseData.GOODSMASTER[i].GOODS_PRICE ? responseData.GOODSMASTER[i].GOODS_PRICE : '',
              GOODS_ALIAS: responseData.GOODSMASTER[i].GOODS_ALIAS ? responseData.GOODSMASTER[i].GOODS_ALIAS : '',
              GOODS_E_ALIAS: responseData.GOODSMASTER[i].GOODS_E_ALIAS ? responseData.GOODSMASTER[i].GOODS_E_ALIAS : '',
              GOODS_BARTYPE: responseData.GOODSMASTER[i].GOODS_BARTYPE ? responseData.GOODSMASTER[i].GOODS_BARTYPE : '',
              UTQ_NAME: responseData.GOODSMASTER[i].UTQ_NAME ? responseData.GOODSMASTER[i].UTQ_NAME : '',
              UTQ_QTY: responseData.GOODSMASTER[i].UTQ_QTY ? responseData.GOODSMASTER[i].UTQ_QTY : '',
              Temp_ARPLU_U_PRC: responseData.GOODSMASTER[i].ARPLU_U_PRC ? responseData.GOODSMASTER[i].ARPLU_U_PRC : '',
              onFocus: false,
              ARPLU_U_PRC: responseData.GOODSMASTER[i].ARPLU_U_PRC ? responseData.GOODSMASTER[i].ARPLU_U_PRC : '',
              ARPLU_U_DSC: responseData.GOODSMASTER[i].ARPLU_U_DSC ? responseData.GOODSMASTER[i].ARPLU_U_DSC : '',
              TAG_CODE: responseData.GOODSMASTER[i].TAG_CODE ? responseData.GOODSMASTER[i].TAG_CODE : '01',
              TAG_NAME: responseData.GOODSMASTER[i].TAG_NAME ? responseData.GOODSMASTER[i].TAG_NAME : ''
            }
            temp_GoodData.push(newGoodobj)
          }
          temp_GoodData.sort((a, b) => (parseInt(a.UTQ_QTY) > parseInt(b.UTQ_QTY)) ? 1 : ((parseInt(b.UTQ_QTY) > parseInt(a.UTQ_QTY)) ? -1 : 0))
          setGOODSMASTER(temp_GoodData)
          setSKUMASTER(newSkuobj)
        } else {
          setGOODSMASTER([])
          setSKUMASTER([])
          setTemp_report(Language.t('alert.errorDetail'));
          AddNewData(fetchBarcodeData)

        }
        setLoading(false)
        setCountdown(-1)
      })
      .catch((error) => {
        console.log(ser_die)
        console.error('ERROR at fetchContent >> ' + error)
      })
  }

  const fetchMotherData = async (tempGuid) => {
    dieSer('fetchMotherData')
    console.log(GOODS_CODE)
    setLoading(true)
    setTemp_report('')
    if (GOODS_CODE) {


      console.log('hit >> ', GOODS_CODE)
      await fetch(loginReducer.endpointMother + '/SetupErp', {
        method: 'POST',
        body: JSON.stringify({
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-LOGIN-GUID': tempGuid ? tempGuid : loginReducer.guidEndPoint,
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
            let newSkuobj = {
              SKU_KEY: responseData.DOCINFO.SKU_KEY ? responseData.DOCINFO.SKU_KEY : '',
              SKU_CODE: responseData.DOCINFO.SKU_CODE ? responseData.DOCINFO.SKU_CODE : '',
              SKU_NAME: responseData.DOCINFO.SKU_NAME ? responseData.DOCINFO.SKU_NAME : '',
              SKU_E_NAME: responseData.DOCINFO.SKU_E_NAME ? responseData.DOCINFO.SKU_E_NAME : '',
              SKU_BARCODE: responseData.DOCINFO.SKU_BARCODE ? responseData.DOCINFO.SKU_BARCODE : '',

              SKU_VAT_TY: responseData.DOCINFO.SKU_VAT_TY ? responseData.DOCINFO.SKU_VAT_TY : 3,
              SKU_VAT: responseData.DOCINFO.SKU_VAT ? responseData.DOCINFO.SKU_VAT : '',
              SKU_COST_TY: responseData.DOCINFO.SKU_COST_TY ? responseData.DOCINFO.SKU_COST_TY : 2,
              SKU_STOCK: responseData.DOCINFO.SKU_STOCK ? responseData.DOCINFO.SKU_STOCK : 1,
              SKU_SENSITIVITY: responseData.DOCINFO.SKU_SENSITIVITY ? responseData.DOCINFO.SKU_SENSITIVITY : 0,

              UTQ_K_NAME: responseData.DOCINFO.UTQ_K_NAME ? responseData.DOCINFO.UTQ_K_NAME : '',
              UTQ_K_QTY: responseData.DOCINFO.UTQ_K_QTY ? responseData.DOCINFO.UTQ_K_QTY : '',
              UTQ_T_NAME: responseData.DOCINFO.UTQ_T_NAME ? responseData.DOCINFO.UTQ_T_NAME : '',
              UTQ_T_QTY: responseData.DOCINFO.UTQ_T_QTY ? responseData.DOCINFO.UTQ_T_QTY : '',
              UTQ_S_NAME: responseData.DOCINFO.UTQ_S_NAME ? responseData.DOCINFO.UTQ_S_NAME : '',
              UTQ_S_QTY: responseData.DOCINFO.UTQ_S_QTY ? responseData.DOCINFO.UTQ_S_QTY : '',

              BRN_CODE: responseData.DOCINFO.BRN_CODE ? responseData.DOCINFO.BRN_CODE : '',
              BRN_NAME: responseData.DOCINFO.BRN_NAME ? responseData.DOCINFO.BRN_NAME : '',

              ICCAT_CODE: responseData.DOCINFO.ICCAT_CODE ? responseData.DOCINFO.ICCAT_CODE : '',
              ICCAT_NAME: responseData.DOCINFO.ICCAT_NAME ? responseData.DOCINFO.ICCAT_NAME : '',
              ICDEPT_CODE: responseData.DOCINFO.ICDEPT_CODE ? responseData.DOCINFO.ICDEPT_CODE : '',
              ICDEPT_THAIDESC: responseData.DOCINFO.ICDEPT_THAIDESC ? responseData.DOCINFO.ICDEPT_THAIDESC : '',
              ICDEPT_ENGDESC: responseData.DOCINFO.ICDEPT_ENGDESC ? responseData.DOCINFO.ICDEPT_ENGDESC : '',

              SKUALT_CODE: responseData.DOCINFO.SKUALT_CODE ? responseData.DOCINFO.SKUALT_CODE : '',
              SKUALT_NAME: responseData.DOCINFO.SKUALT_NAME ? responseData.DOCINFO.SKUALT_NAME : '',

              ICCOLOR_CODE: responseData.DOCINFO.ICCOLOR_CODE ? responseData.DOCINFO.ICCOLOR_CODE : '',
              ICCOLOR_NAME: responseData.DOCINFO.ICCOLOR_NAME ? responseData.DOCINFO.ICCOLOR_NAME : '',
              ICSIZE_CODE: responseData.DOCINFO.ICSIZE_CODE ? responseData.DOCINFO.ICSIZE_CODE : '',
              ICSIZE_NAME: responseData.DOCINFO.ICSIZE_NAME ? responseData.DOCINFO.ICSIZE_NAME : '',
              ICGL_CODE: responseData.DOCINFO.ICGL_CODE ? responseData.DOCINFO.ICGL_CODE : '',
              ICGL_NAME: responseData.DOCINFO.ICGL_NAME ? responseData.DOCINFO.ICGL_NAME : '',
              ICPRT_CODE: responseData.DOCINFO.ICPRT_CODE ? responseData.DOCINFO.ICPRT_CODE : '',
              ICPRT_NAME: responseData.DOCINFO.ICPRT_NAME ? responseData.DOCINFO.ICPRT_NAME : '',

              WL_CODE: responseData.DOCINFO.WL_CODE ? responseData.DOCINFO.WL_CODE : '',
              WL_NAME: responseData.DOCINFO.WL_NAME ? responseData.DOCINFO.WL_NAME : '',

              SKU_PROPERTIES: isSFeatures
            }
            console.log('newSkuobj>>', newSkuobj)
            let temp_GoodData = [];
            for (var i in responseData.GOODSMASTER) {

              let newGoodobj = {
                GOODS_KEY: responseData.GOODSMASTER[i].GOODS_KEY ? responseData.GOODSMASTER[i].GOODS_KEY : '',
                GOODS_CODE: responseData.GOODSMASTER[i].GOODS_CODE ? responseData.GOODSMASTER[i].GOODS_CODE : '',
                GOODS_SKU: responseData.GOODSMASTER[i].GOODS_SKU ? responseData.GOODSMASTER[i].GOODS_SKU : '',
                GOODS_PRICE: responseData.GOODSMASTER[i].GOODS_PRICE ? responseData.GOODSMASTER[i].GOODS_PRICE : '',
                GOODS_ALIAS: responseData.GOODSMASTER[i].GOODS_ALIAS ? responseData.GOODSMASTER[i].GOODS_ALIAS : '',
                GOODS_E_ALIAS: responseData.GOODSMASTER[i].GOODS_E_ALIAS ? responseData.GOODSMASTER[i].GOODS_E_ALIAS : '',
                GOODS_BARTYPE: responseData.GOODSMASTER[i].GOODS_BARTYPE ? responseData.GOODSMASTER[i].GOODS_BARTYPE : '',
                UTQ_NAME: responseData.GOODSMASTER[i].UTQ_NAME ? responseData.GOODSMASTER[i].UTQ_NAME : '',
                UTQ_QTY: responseData.GOODSMASTER[i].UTQ_QTY ? responseData.GOODSMASTER[i].UTQ_QTY : '',
                Temp_ARPLU_U_PRC: responseData.GOODSMASTER[i].ARPLU_U_PRC ? responseData.GOODSMASTER[i].ARPLU_U_PRC : '',
                onFocus: false,
                ARPLU_U_PRC: responseData.GOODSMASTER[i].ARPLU_U_PRC ? responseData.GOODSMASTER[i].ARPLU_U_PRC : '',
                ARPLU_U_DSC: responseData.GOODSMASTER[i].ARPLU_U_DSC ? responseData.GOODSMASTER[i].ARPLU_U_DSC : '',
                TAG_CODE: responseData.GOODSMASTER[i].TAG_CODE ? responseData.GOODSMASTER[i].TAG_CODE : '01',
                TAG_NAME: responseData.GOODSMASTER[i].TAG_NAME ? responseData.GOODSMASTER[i].TAG_NAME : ''
              }
              temp_GoodData.push(newGoodobj)
            }
            temp_GoodData.sort((a, b) => (parseInt(a.UTQ_QTY) > parseInt(b.UTQ_QTY)) ? 1 : ((parseInt(b.UTQ_QTY) > parseInt(a.UTQ_QTY)) ? -1 : 0))
            console.log(temp_GoodData)
            setSKUMASTER(newSkuobj)
            setGOODSMASTER(temp_GoodData)

            setLoading(false)

          } else {
            setSKUMASTER([])
            setGOODSMASTER([])
            setTemp_report(Language.t('alert.errorDetail'));
            AddNewData()

            setLoading(false)
          }
          setCountdown(-1)

        })
        .catch((error) => {
          console.log(ser_die)
          console.error('ERROR at fetchContent >> ' + error)
        })
    } else {
      setSKUMASTER([])
      setGOODSMASTER([])
      Alert.alert(Language.t('alert.errorTitle'), Language.t('alert.incompleteInformation'), [{
        text: Language.t('alert.ok'), onPress: () => { }
      }]);
      setLoading(false)
      setCountdown(-1)
    }
  }
  const CpushData = async () => {
    let C = false
    for (var i in GOODSMASTER) {
      if (GOODSMASTER[i].ARPLU_U_PRC == 0 || GOODSMASTER[i].ARPLU_U_PRC == '') {
        C = true
        break
      }
      console.log(GOODSMASTER[i].ARPLU_U_PRC)
    }
    console.log(C)
    if (C)
      Alert.alert(Language.t('menu.alertsave0Message'), Language.t('menu.alertsaveMessage'), [{ text: Language.t('alert.ok'), onPress: () => pushData() }, { text: Language.t('alert.cancel'), onPress: () => { } }])
    else pushData()
  }
  const pushData = async () => {
    dieSer('pushData')
    setLoading(true)

    if (Temp_report != '') {
      let temp_good = '';
      for (var i in GOODSMASTER) {
        if (i > 0) temp_good += ','
        temp_good += '{' +
          '\"GOODS_KEY\": \"' + GOODSMASTER[i].GOODS_KEY +
          '\",\"GOODS_SKU\": \"' + GOODSMASTER[i].GOODS_SKU +
          '\",\"GOODS_CODE\": \"' + GOODSMASTER[i].GOODS_CODE +
          '\",\"GOODS_PRICE\": \"' + GOODSMASTER[i].GOODS_PRICE +
          '\",\"GOODS_ALIAS\": \"' + GOODSMASTER[i].GOODS_ALIAS +
          '\",\"GOODS_E_ALIAS\": \"' + GOODSMASTER[i].GOODS_E_ALIAS +
          '\",\"GOODS_BARTYPE\": \"' + GOODSMASTER[i].GOODS_BARTYPE +
          '\",\"UTQ_NAME\": \"' + GOODSMASTER[i].UTQ_NAME +
          '\",\"UTQ_QTY\": \"' + GOODSMASTER[i].UTQ_QTY +
          '\",\"ARPLU_U_PRC\": \"' + GOODSMASTER[i].ARPLU_U_PRC +
          '\",\"ARPLU_U_DSC\": \"' + GOODSMASTER[i].ARPLU_U_DSC +
          '\",\"TAG_CODE\": \"' + GOODSMASTER[i].TAG_CODE +
          '\",\"TAG_NAME\": \"' + GOODSMASTER[i].TAG_NAME +
          '\"}'
      }

      console.log(databaseReducer.Data.urlser)
      await fetch(databaseReducer.Data.urlser + '/SetupErp', {
        method: 'POST',
        body: JSON.stringify({
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-LOGIN-GUID': loginReducer.guid,
          'BPAPUS-FUNCTION': 'UPDATESKUINFOBYGOODSCODE',
          'BPAPUS-PARAM':
            '{\"UpdateSkuInfoByGoodsCode\":' + '[{\"SKUMASTER\": {' +
            '\"SKU_KEY\": \"' + SKUMASTER.SKU_KEY +
            '\",\"SKU_CODE\": \"' + SKUMASTER.SKU_CODE +
            '\",\"SKU_NAME\": \"' + SKUMASTER.SKU_NAME +
            '\",\"SKU_E_NAME\": \"' + SKUMASTER.SKU_E_NAME +
            '\",\"SKU_BARCODE\": \"' + SKUMASTER.SKU_BARCODE +
            '\",\"SKU_VAT_TY\": \"' + SKUMASTER.SKU_VAT_TY +
            '\",\"SKU_VAT\": \"' + SKUMASTER.SKU_VAT +
            '\",\"SKU_COST_TY\": \"' + SKUMASTER.SKU_COST_TY +
            '\",\"SKU_STOCK\": \"' + SKUMASTER.SKU_STOCK +
            '\",\"SKU_SENSITIVITY\": \"' + SKUMASTER.SKU_SENSITIVITY +
            '\",\"UTQ_K_NAME\": \"' + SKUMASTER.UTQ_K_NAME +
            '\",\"UTQ_K_QTY\": \"' + SKUMASTER.UTQ_K_QTY +
            '\",\"UTQ_T_NAME\": \"' + SKUMASTER.UTQ_T_NAME +
            '\",\"UTQ_T_QTY\": \"' + SKUMASTER.UTQ_T_QTY +
            '\",\"UTQ_S_NAME\": \"' + SKUMASTER.UTQ_S_NAME +
            '\",\"UTQ_S_QTY\": \"' + SKUMASTER.UTQ_S_QTY +
            '\",\"BRN_CODE\": \"' + SKUMASTER.BRN_CODE +
            '\",\"BRN_NAME\": \"' + SKUMASTER.BRN_NAME +
            '\",\"ICCAT_CODE\": \"' + SKUMASTER.ICCAT_CODE +
            '\",\"ICCAT_NAME\": \"' + SKUMASTER.ICCAT_NAME +
            '\",\"ICDEPT_CODE\": \"' + SKUMASTER.ICDEPT_CODE +
            '\",\"ICDEPT_THAIDESC\": \"' + SKUMASTER.ICDEPT_THAIDESC +
            '\",\"ICDEPT_ENGDESC\": \"' + SKUMASTER.ICDEPT_ENGDESC +
            '\",\"SKUALT_CODE\": \"' + SKUMASTER.SKUALT_CODE +
            '\",\"SKUALT_NAME\": \"' + SKUMASTER.SKUALT_NAME +
            '\",\"ICCOLOR_CODE\": \"' + SKUMASTER.ICCOLOR_CODE +
            '\",\"ICCOLOR_NAME\": \"' + SKUMASTER.ICCOLOR_NAME +
            '\",\"ICSIZE_CODE\": \"' + SKUMASTER.ICSIZE_CODE +
            '\",\"ICSIZE_NAME\": \"' + SKUMASTER.ICSIZE_NAME +
            '\",\"ICGL_CODE\": \"' + SKUMASTER.ICGL_CODE +
            '\",\"ICGL_NAME\": \"' + SKUMASTER.ICGL_NAME +
            '\",\"ICPRT_CODE\": \"' + SKUMASTER.ICPRT_CODE +
            '\",\"ICPRT_NAME\": \"' + SKUMASTER.ICPRT_NAME +
            '\",\"WL_CODE\": \"' + SKUMASTER.WL_CODE +
            '\",\"WL_NAME\" : \"' + SKUMASTER.WL_NAME +
            '\",\"SKU_PROPERTIES\" : ' + isSFeatures +
            '},\"GOODSMASTER\":[' + temp_good + ']}]' + '}',
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        })
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.ResponseCode == '200') Alert.alert(Language.t('alert.succeed'), Language.t('alert.savesucceed'), [{
            text: Language.t('alert.ok'), onPress: () => { on_cancel() }
          }]);
          else Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.incorrect'), [{
              text: Language.t('alert.ok'), onPress: () => { }
            }]);
          console.log(json)

          setLoading(false)
          on_cancel()
          setCountdown(-1)
        })
        .catch((error) => {
          console.log('Function Parameter Required');
        })
    } else {
      setLoading(false)
      AddNewData()

    }

  }


  return (
    <View style={container1}>
      <StatusBar hidden={true} />
      <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={styles.image}>
        {!loading_backG ? <>
           
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
                onSubmitEditing={() => fetchMotherData()}
                onChangeText={(val) => {
                  setGOODS_CODE(val)
                }} />

              <TouchableOpacity style={{ paddingTop: 10,paddingBottom: 10, }} onPress={() => fetchMotherData()}>
                <Image
                  source={
                    require('../images/UI/SKU/4x/Asset26_4x.png')
                  }
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 5,  }} onPress={() => on_scan()}>
              <Image
                source={
                  require('../images/UI/SKU/4x/Asset30_4x.png')
                }
                style={{
                  width: 40,
                  height: 40,
                }}
              />
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
                }}>
                {Temp_report ? Temp_report : null}
              </Text>
            </View>
          </View>
        <View style={{height:deviceHeight/2.2}}>
        <ScrollView   >
          
          <KeyboardAvoidingView keyboardVerticalOffset={1}>
            <View style={styles.body}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={{ flex: 0.5 }}  >
                    <Text style={{
                      fontSize: FontSize.medium,
                      color: Colors.backgroundColorSecondary,
                      fontWeight: 'bold'
                    }}> {Language.t('main.code')}</Text></View>
                  <View style={{ flex: 0.3, }}  >
                    <Text style={{
                      fontSize: FontSize.medium,
                      color: Colors.backgroundColorSecondary,
                      fontWeight: 'bold'
                    }}>{Language.t('main.unit')}</Text></View>
                  <View style={{ flex: 0.3 }} >
                    <Text style={{
                      fontSize: FontSize.medium,
                      color: Colors.backgroundColorSecondary,
                      fontWeight: 'bold'
                    }}> {Language.t('main.price')} </Text></View>
                </View>
                <ScrollView>
                      {GOODSMASTER.length <= 0 ? (
                        <>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}>
                            </Text>
                          </View>
                        </>) : (<>
                          {GOODSMASTER.map((item) => {
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
                                />
                                <View style={{
                                  color: Colors.fontColor,
                                  fontSize: FontSize.medium,
                                  flex: 0.3
                                }}>
                                  <TextInput
                                    style={{
                                      color: Colors.fontColor,
                                    }}
                                    multiline={true}
                                    editable={false}
                                    placeholderTextColor={Colors.fontColorSecondary}
                                    value={item.onFocus == false ? item.UTQ_NAME : `${item.UTQ_NAME} ( ${item.Temp_ARPLU_U_PRC.length > 0 ? item.Temp_ARPLU_U_PRC : 0} )`}
                                  />
                                </View>

                                {item.onFocus == true ? <>
                                  <TextInput
                                    style={{
                                      color: Colors.fontColor,
                                      fontSize: FontSize.medium,
                                      borderBottomColor: Colors.backgroundLoginColor,
                                      borderBottomWidth: 1,
                                      padding: 0,
                                      backgroundColor: Colors.backgroundColorSecondary,
                                      flex: 0.3,
                                    }}
                                    keyboardType="number-pad"
                                    placeholderTextColor={Colors.fontColorSecondary}
                                    value={item.ARPLU_U_PRC}
                                    multiline={true}
                                    textAlign={'right'}
                                    placeholder={Language.t('main.pprice') + '..'}
                                    onBlur={() => set_Focus(item.GOODS_CODE, false)}
                                    onChangeText={(val) => {
                                      set_SkuP(item.GOODS_CODE, val)
                                    }}
                                  />
                                </> : <>
                                  < TouchableOpacity
                                    style={{
                                      color: Colors.fontColor,
                                      fontSize: FontSize.medium,
                                      borderBottomColor: Colors.backgroundLoginColor,
                                      borderBottomWidth: 1,
                                      padding: 0,
                                      backgroundColor: Colors.backgroundColorSecondary,
                                      flex: 0.3,
                                    }}
                                    onPress={() => {
                                      set_Focus(item.GOODS_CODE, true)
                                    }}>
                                    <CurrencyInput
                                      style={{ color: Colors.fontColor, }}
                                      editable={false}
                                      delimiter=","
                                      separator="."
                                      precision={2}
                                      keyboardType="number-pad"
                                      placeholderTextColor={Colors.fontColorSecondary}
                                      value={item.ARPLU_U_PRC}
                                      multiline={true}
                                      textAlign={'right'}
                                      placeholder={Language.t('main.pprice') + '..'}
                                      onPress={() => {
                                        set_Focus(item.GOODS_CODE, true)
                                      }}
                                    />
                                  </TouchableOpacity>
                                </>}
                              </View>
                            )
                          })}
                          <TouchableOpacity style={{ width: deviceWidth / 3, }} onPress={() => Alert.alert('', Language.t('trading.addTrading'), [{ text: Language.t('selectBase.yes'), onPress: () => navigation.navigate('AddbarSKUScreen', { post: '', data: '', SKUMASTER: SKUMASTER, GOODSMASTER: GOODSMASTER }) }, { text: Language.t('selectBase.no'), onPress: () => { } }])}>
                            <View style={{ margin: 10, padding: 10, flexDirection: "row", justifyContent: 'space-between', backgroundColor: Colors.loadingColor, borderRadius: 10, }}>
                              <FontAwesome name="plus" style={{ color: Colors.backgroundLoginColorSecondary, }} size={FontSize.large} />
                              <Text style={{ color: Colors.backgroundLoginColorSecondary, fontSize: FontSize.medium, }}>{Language.t('alert.add')}</Text>
                            </View>
                          </TouchableOpacity>
                          <View style={styles.tableView}>
                            <Text
                              style={{
                                color: Colors.fontColor,
                                fontSize: FontSize.medium,
                                flex: 0.5
                              }}
                            >
                            </Text>
                          </View>
                        </>)}
                 
                 
                </ScrollView>
               

              </View>
            </View>

          </KeyboardAvoidingView>

        
      </ScrollView>
        </View>
         
         
          <View style={styles.footer}>
            <View></View>
            <TouchableOpacity style={{ padding: 10, }} onPress={() => Alert.alert('', Language.t('menu.alertLogoutMessage'), [{ text: Language.t('alert.ok'), onPress: () => logOut() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}>
              <Image
                source={
                  require('../images/UI/SKU/4x/Asset27_4x.png')
                }
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 10, }} onPress={() => Alert.alert('', Language.t('menu.alertsaveMessage'), [{ text: Language.t('alert.ok'), onPress: () => CpushData() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}>
              <Image
                source={
                  require('../images/UI/SKU/4x/Asset28_4x.png')
                }
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 10, }} onPress={() => on_cancel()}>
              <Image
                source={
                  require('../images/UI/SKU/4x/Asset29_4x.png')
                }
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 10, }} onPress={() => on_scan()}>
              <Image
                source={
                  require('../images/UI/SKU/4x/Asset30_4x.png')
                }
                style={{
                  width: 60,
                  height: 60,
                }}
              />
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
    flexDirection: 'column',
  },
  body: {
    margin: 10,
    marginBottom: 60,

    borderRadius: 15,
    backgroundColor: Colors.backgroundColorSecondary
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
export default connect(mapStateToProps, mapDispatchToProps)(SKUScreen);
