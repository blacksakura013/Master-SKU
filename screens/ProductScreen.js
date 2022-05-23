import React, { useState, useEffect, useRef } from 'react';
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

import { Language, changeLanguage } from '../translations/I18n';
import DeviceInfo, { getType } from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var ser_die = true
import * as productActions from '../src/actions/productActions';
import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';
import safe_Format from '../src/safe_Format';
import { fontWeight, height, margin } from 'styled-system';

const ProductScreen = ({ route }) => {
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


  const scrollViewRef = useRef();

  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const productReducer = useSelector(({ productReducer }) => productReducer);
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
  const [marker, setMarker] = useState(true);
  const [items, setItems] = useState([]);
  const [sum, setSum] = useState(0);
  const [SKUMASTER, setSKUMASTER] = useState({});
  const [GOODSMASTER, setGOODSMASTER] = useState(productReducer.Data ? productReducer.Data : []);
  const [DI_REF, setDI_REF] = useState({ DI_REF: '<เลขถัดไป>', INFO: '<เลขเดียวกัน>' })
  const [PRODUCTMASTER, setPRODUCTMASTER] = useState({});
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

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const set_goodData = (temp_data) => {
    dispatch(productActions.setData(temp_data))
    setGOODSMASTER(temp_data)
  }
  const setapiDay = async () => {

    await fetch('http://worldtimeapi.org/api/timezone/Asia/Bangkok', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((json) => {
        let datetime = json.utc_datetime
        console.log()
        console.log('>')
        console.log(datetime)
        console.log()
        var x = new Date(datetime)
        console.log(x)
        let yesr = x.getFullYear().toString()
        let month = (x.getMonth() + 1).toString().length > 1 ? (x.getMonth() + 1).toString() : '0' + (x.getMonth() + 1).toString()
        let date = x.getDate().toString().length > 1 ? x.getDate().toString() : '0' + x.getDate().toString()
        let fullDay = yesr + month + date
        console.log(fullDay)
        if (productReducer.Log_data.date) {
          if (productReducer.Log_data.date == fullDay) {
            on_cancel()
            get_DI_REF(productReducer.Log_data.DI_KEY)
          }
        }
      })
      .catch((error) => {
        console.log(ser_die)
        console.error('ERROR at fetchContent >> ' + error)
      })
  }
  useEffect(async () => {
    //dispatch(productActions.setData([]))
    // dispatch(productActions.setLog_Data([]))

    await setapiDay()



    console.log()
    console.log('>> productReducer : ', productReducer.Data)
    console.log()
    console.log('>> LOG _ productReducer : ', productReducer.Log_data)
    console.log()
    console.log('>> Address : ', loginReducer.ipAddress)
    console.log()
    console.log('>> isSFeatures : ', loginReducer.isSFeatures, isSFeatures)
    console.log()
    console.log(`>> databaseReducer.Data.urlser ${loginReducer.endpointMother}`)
    console.log()
    console.log('>> Day : ',)
    console.log()

  }, [])

  useEffect(() => {
    console.log(`>>  PRODUCTMASTER ${GOODSMASTER}`)
    let tempSum = 0
    for (var i in GOODSMASTER)
      tempSum += GOODSMASTER[i].TRD_QTY * GOODSMASTER[i].TRD_K_U_PRC
    console.log(tempSum)
    setSum(tempSum)
  }, [GOODSMASTER]);
  useEffect(() => {

    console.log(`>>   productReducer.Data ${productReducer.Data}`)

  }, [productReducer.Data])
  useEffect(() => {

    if (route.params.post) {
      setGOODS_CODE(route.params.post)
      fetchBarcodeData(route.params.post)
    }
    if (route.params.GOODSMASTER) {
      for (var i in route.params.GOODSMASTER)
        console.log(`GOODSMASTER >> ${route.params.GOODSMASTER[i]}`)
      // route.params.GOODSMASTER.map((item) => {
      //   return console.log(`GOODSMASTER >> ${item}`)
      // })
      let tempSum = 0
      for (var i in route.params.GOODSMASTER)
        tempSum += route.params.GOODSMASTER[i].TRD_QTY * route.params.GOODSMASTER[i].TRD_K_U_PRC
      console.log(tempSum)
      setSum(tempSum)


      setGOODSMASTER(route.params.GOODSMASTER)
    }
    if (route.params.SKUMASTER) {

      console.log(`SKUMASTER >> ${route.params.SKUMASTER.UTQ_S_NAME}`)

      setSKUMASTER(route.params.SKUMASTER)
      setTemp_report(route.params.SKUMASTER.SKU_NAME)
      setGOODS_CODE(route.params.SKUMASTER.SKU_CODE)
    }
    if (route.params.data && route.params.data == 'on_cancel') {
      on_cancel()
    }



  }, [route.params?.data])
  useEffect(() => {
    if (countdown === 0) {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('selectBase.UnableConnec'), [{ text: Language.t('selectBase.connectAgain'), onPress: () => connectAgain() }, { text: Language.t('main.cancel'), onPress: () => BackHandler.exitApp() }]);
    }
    console.log(countdown)
  }, [countdown])

  const decrementClock = () => {
    if (countdown === 0) {

      setCountdown(0);
      clearInterval(clockCall);
    } else {
      setCountdown(countdown - 1);
    }
  }

  const currencyFormat = (num) => {
    if (num == 0) return '-'
    else return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const on_scan = () => {
    on_cancel()
    navigation.navigate('Scanbarcode', { route: 'ProductScreen', data: 'go', GOODSMASTER: GOODSMASTER })
  }

  const on_cancel = () => {
    setGOODS_CODE('')
    setTemp_report('')
    setPRODUCTMASTER({})
  }

  const on_clear = () => {
    setGOODS_CODE('')
    setTemp_report('')
    setGOODSMASTER([])
    setPRODUCTMASTER({})
    dispatch(productActions.setData([]))
  }

  const get_DI_REF = async (DI_KEY) => {

    setTemp_report('')
    console.log('hit >> ', DI_KEY)
    await fetch(databaseReducer.Data.urlser + '/UpdateErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetReceiveDocinfo',
        'BPAPUS-PARAM':
          '{"DI_KEY": "' +
          DI_KEY + '"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);
        console.log(responseData.RECORD_COUNT)
        if (responseData.RECORD_COUNT > 0) {
          console.log()
          console.log('responseData ', responseData.DOCINFO.DI_REF)
          console.log()
          var inputyear = Number(productReducer.Log_data.date.substring(0, 4)) + 543
          var inputmonths = productReducer.Log_data.date.substring(4, 6)
          var inputdate = productReducer.Log_data.date.substring(6, 8)
          var inputFullDate = inputdate + '/' + inputmonths + '/' + inputyear
          Alert.alert(Language.t('notiAlert.header'), `เนื่องจากวันนี้มีการเพิ่มเอกสารรับสินค้าแล้ว\nเมื่อวันที่ ${inputFullDate} เวลา ${productReducer.Log_data.time}น.\nคุณต้องการแก้ไขเอกสารหรือไม่`, [{
            text: Language.t('alert.confirm'), onPress: () => { set_goodData(productReducer.Log_data.GOODSMASTER) }
          }, {
            text: Language.t('alert.cancel'), onPress: () => { navigation.goBack() }
          }]);
          setCountdown(-1)
          setLoading(false)
          let objDI_REF = {
            DI_REF: responseData.DOCINFO.DI_REF,
            INFO: responseData.DOCINFO.DI_REF
          }
          setDI_REF(objDI_REF)

        }
        setLoading(false)
        setCountdown(-1)
      })
      .catch((error) => {
        console.log(ser_die)
        console.error('ERROR at fetchContent >> ' + error)
      })
  }

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

  const set_Focus = (sta, onFocus, index) => {

    console.log('onFocus >>   ', onFocus)
    console.log('index > ', index)
    let temp_array = [];

    for (var i in GOODSMASTER) {
      if (i == index && sta == 'QTY') {
        let newProduct = {
          TRD_DSC_KEYINV: GOODSMASTER[i].TRD_DSC_KEYINV,
          TRD_C_DSCV: GOODSMASTER[i].TRD_C_DSCV,
          TRD_OPTION: GOODSMASTER[i].TRD_OPTION,
          TRD_KEYIN: GOODSMASTER[i].TRD_KEYIN,
          SKU_KEY: GOODSMASTER[i].SKU_KEY,
          SKU_NAME: GOODSMASTER[i].SKU_NAME,
          UTQ_NAME: GOODSMASTER[i].UTQ_NAME,
          TRD_QTY: GOODSMASTER[i].TRD_QTY,
          onSave: false,
          onFocusQTY: onFocus,
          onFocusTRD_K_U_PRC: GOODSMASTER[i].onFocusTRD_K_U_PRC,
          date_in: GOODSMASTER[i].date_in,
          Temp_TRD_K_U_PRC: GOODSMASTER[i].Temp_TRD_K_U_PRC,
          TRD_K_U_PRC: GOODSMASTER[i].TRD_K_U_PRC,
          Temp_ARPLU_U_PRC: GOODSMASTER[i].Temp_ARPLU_U_PRC,
          TRD_DSC_KEYIN: GOODSMASTER[i].TRD_DSC_KEYIN,
          TRD_Q_FREE: GOODSMASTER[i].TRD_Q_FREE,
          TRD_WL: GOODSMASTER[i].TRD_WL,
          TRD_TO_WL: GOODSMASTER[i].TRD_TO_WL,
          TRD_U_VATIO: GOODSMASTER[i].TRD_U_VATIO,
        }
        temp_array.push(newProduct)
      } else if (i == index && sta != 'QTY') {
        let newProduct = {
          TRD_DSC_KEYINV: GOODSMASTER[i].TRD_DSC_KEYINV,
          TRD_C_DSCV: GOODSMASTER[i].TRD_C_DSCV,
          TRD_OPTION: GOODSMASTER[i].TRD_OPTION,
          TRD_KEYIN: GOODSMASTER[i].TRD_KEYIN,
          SKU_KEY: GOODSMASTER[i].SKU_KEY,
          SKU_NAME: GOODSMASTER[i].SKU_NAME,
          UTQ_NAME: GOODSMASTER[i].UTQ_NAME,
          TRD_QTY: GOODSMASTER[i].TRD_QTY,
          onSave: false,
          onFocusQTY: GOODSMASTER[i].onFocusQTY,
          onFocusTRD_K_U_PRC: onFocus,
          date_in: GOODSMASTER[i].date_in,
          Temp_TRD_K_U_PRC: GOODSMASTER[i].Temp_TRD_K_U_PRC,
          TRD_K_U_PRC: GOODSMASTER[i].TRD_K_U_PRC,
          Temp_ARPLU_U_PRC: GOODSMASTER[i].Temp_ARPLU_U_PRC,
          TRD_DSC_KEYIN: GOODSMASTER[i].TRD_DSC_KEYIN,
          TRD_Q_FREE: GOODSMASTER[i].TRD_Q_FREE,
          TRD_WL: GOODSMASTER[i].TRD_WL,
          TRD_TO_WL: GOODSMASTER[i].TRD_TO_WL,
          TRD_U_VATIO: GOODSMASTER[i].TRD_U_VATIO,
        }
        temp_array.push(newProduct)
      } else {
        temp_array.push(GOODSMASTER[i])
      }
    }



    let tempSum = 0
    for (var i in temp_array)
      tempSum += temp_array[i].TRD_QTY * temp_array[i].TRD_K_U_PRC
    console.log(tempSum)
    setSum(tempSum)
    setGOODSMASTER(temp_array)
    console.log(temp_array)
  }
  const set_SkuP = (TRD_K_U_PRC, index) => {

    console.log('TRD_K_U_PRC >>   ', TRD_K_U_PRC)
    console.log('index > ', index)
    let temp_array = [];
    for (var i in GOODSMASTER) {
      if (i == index) {
        let newProduct = {
          TRD_DSC_KEYINV: GOODSMASTER[i].TRD_DSC_KEYINV,
          TRD_C_DSCV: GOODSMASTER[i].TRD_C_DSCV,
          TRD_OPTION: GOODSMASTER[i].TRD_OPTION,
          TRD_KEYIN: GOODSMASTER[i].TRD_KEYIN,
          SKU_KEY: GOODSMASTER[i].SKU_KEY,
          SKU_NAME: GOODSMASTER[i].SKU_NAME,
          UTQ_NAME: GOODSMASTER[i].UTQ_NAME,
          TRD_QTY: GOODSMASTER[i].TRD_QTY,
          onSave: false,
          onFocusQTY: GOODSMASTER[i].onFocusQTY,
          onFocusTRD_K_U_PRC: GOODSMASTER[i].onFocusTRD_K_U_PRC,
          date_in: GOODSMASTER[i].date_in,
          Temp_TRD_K_U_PRC: GOODSMASTER[i].Temp_TRD_K_U_PRC,
          TRD_K_U_PRC: TRD_K_U_PRC,
          Temp_ARPLU_U_PRC: GOODSMASTER[i].Temp_ARPLU_U_PRC,
          TRD_DSC_KEYIN: GOODSMASTER[i].TRD_DSC_KEYIN,
          TRD_Q_FREE: GOODSMASTER[i].TRD_Q_FREE,
          TRD_WL: GOODSMASTER[i].TRD_WL,
          TRD_TO_WL: GOODSMASTER[i].TRD_TO_WL,
          TRD_U_VATIO: GOODSMASTER[i].TRD_U_VATIO,
        }
        temp_array.push(newProduct)
      } else {
        temp_array.push(GOODSMASTER[i])
      }
    }
    let tempSum = 0
    for (var i in temp_array)
      tempSum += temp_array[i].TRD_QTY * temp_array[i].TRD_K_U_PRC
    console.log(tempSum)
    setSum(tempSum)
    setGOODSMASTER(temp_array)
    console.log(temp_array)

  }
  const set_SkuTRD_QTY = (TRD_QTY, index) => {
    console.log('TRD_QTY >>   ', TRD_QTY)
    console.log('index > ', index)
    let temp_array = [];
    for (var i in GOODSMASTER) {
      if (i == index) {
        let newProduct = {
          TRD_DSC_KEYINV: GOODSMASTER[i].TRD_DSC_KEYINV,
          TRD_C_DSCV: GOODSMASTER[i].TRD_C_DSCV,
          TRD_OPTION: GOODSMASTER[i].TRD_OPTION,
          TRD_KEYIN: GOODSMASTER[i].TRD_KEYIN,
          SKU_KEY: GOODSMASTER[i].SKU_KEY,
          SKU_NAME: GOODSMASTER[i].SKU_NAME,
          UTQ_NAME: GOODSMASTER[i].UTQ_NAME,
          TRD_QTY: TRD_QTY,
          onSave: false,
          onFocusQTY: GOODSMASTER[i].onFocusQTY,
          onFocusTRD_K_U_PRC: GOODSMASTER[i].onFocusTRD_K_U_PRC,
          date_in: GOODSMASTER[i].date_in,
          Temp_TRD_K_U_PRC: GOODSMASTER[i].Temp_TRD_K_U_PRC,
          TRD_K_U_PRC: GOODSMASTER[i].TRD_K_U_PRC,
          Temp_ARPLU_U_PRC: GOODSMASTER[i].Temp_ARPLU_U_PRC,
          TRD_DSC_KEYIN: GOODSMASTER[i].TRD_DSC_KEYIN,
          TRD_Q_FREE: GOODSMASTER[i].TRD_Q_FREE,
          TRD_WL: GOODSMASTER[i].TRD_WL,
          TRD_TO_WL: GOODSMASTER[i].TRD_TO_WL,
          TRD_U_VATIO: GOODSMASTER[i].TRD_U_VATIO,
        }
        temp_array.push(newProduct)
      } else {
        temp_array.push(GOODSMASTER[i])
      }
    }

    let tempSum = 0
    for (var i in temp_array)
      tempSum += temp_array[i].TRD_QTY * temp_array[i].TRD_K_U_PRC
    console.log(tempSum)
    setSum(tempSum)

    setGOODSMASTER(temp_array)

  }
  const sumTRD_QTY = (a, b) => {
    return parseInt(a) + parseInt(b)
  }
  const pop_saveSku = (tempData, index) => {
    let unique = []
    let uniqueArray = []
    console.log('tempData >>', tempData)
    let ReducertempData = []
    if (tempData) {

      for (var i in productReducer.Data) {
        if (i == index) {
          let ReducerProduct = {
            TRD_DSC_KEYINV: tempData.TRD_DSC_KEYINV,
            TRD_C_DSCV: tempData.TRD_C_DSCV,
            TRD_OPTION: tempData.TRD_OPTION,
            TRD_KEYIN: tempData.TRD_KEYIN,
            SKU_KEY: tempData.SKU_KEY,
            SKU_NAME: tempData.SKU_NAME,
            UTQ_NAME: tempData.UTQ_NAME,
            TRD_QTY: tempData.TRD_QTY,
            onSave: false,
            onFocusQTY: false,
            onFocusTRD_K_U_PRC: false,
            date_in: tempData.date_in,
            Temp_TRD_K_U_PRC: tempData.Temp_TRD_K_U_PRC,
            TRD_K_U_PRC: tempData.TRD_K_U_PRC,
            Temp_ARPLU_U_PRC: tempData.Temp_ARPLU_U_PRC,
            TRD_DSC_KEYIN: tempData.TRD_DSC_KEYIN,
            TRD_Q_FREE: tempData.TRD_Q_FREE,
            TRD_WL: tempData.TRD_WL,
            TRD_TO_WL: tempData.TRD_TO_WL,
            TRD_U_VATIO: tempData.TRD_U_VATIO,
          }
          ReducertempData.push(ReducerProduct)
        }
      }
      for (var i in GOODSMASTER) {
        if (i != parseInt(index)) ReducertempData.push(GOODSMASTER[i])
      }
      const newArray = [];
      ReducertempData.forEach(obj => {
        if (!newArray.some(o => o === obj)) {
          uniqueArray.push({ ...obj })
          unique.push({ ...obj })
        }
      })

      unique.sort((a, b) => {
        if (a.date_in > b.date_in) {
          return 1;
        }
        if (a.date_in < b.date_in) {
          return -1;
        }
        return 0;
      });
      dispatch(productActions.setData(uniqueArray))
      setGOODSMASTER(unique)
    }

  }
  const set_saveSku = (temp, index) => {
    console.log('tempData >>', temp)
    console.log('index >>', index)
    let tempReducer = []
    let tempData = temp
    let unique = []
    let uniqueArray = []
    let c = true;

    if (tempData) {
      console.log()
      console.log('tempData > ', tempData.TRD_QTY)
      if (tempData.TRD_QTY == 0 || tempData.TRD_QTY == '') {
        for (var i in GOODSMASTER) {
          console.log(index, i, GOODSMASTER)
          if (i != index) tempReducer.push(GOODSMASTER[i])
        }
        setGOODSMASTER(tempReducer)
      } else {
        if (productReducer.Data) {
          for (var i in productReducer.Data) {
            productReducer.Data[i].TRD_K_U_PRC = parseFloat(productReducer.Data[i].TRD_K_U_PRC)
            tempData.TRD_K_U_PRC = parseFloat(tempData.TRD_K_U_PRC)
            console.log()
            console.log('length', productReducer.Data.filter((filterItem) => { return (filterItem.TRD_KEYIN == tempData.TRD_KEYIN && parseFloat(filterItem.TRD_K_U_PRC) == tempData.TRD_K_U_PRC) }).length)
            if (productReducer.Data[i].TRD_KEYIN == tempData.TRD_KEYIN && productReducer.Data[i].TRD_K_U_PRC == tempData.TRD_K_U_PRC && productReducer.Data[i].onSave == true &&
              productReducer.Data.filter((filterItem) => { return (filterItem.TRD_KEYIN == tempData.TRD_KEYIN && parseFloat(filterItem.TRD_K_U_PRC) == tempData.TRD_K_U_PRC && filterItem.onSave == true) }).length > 0) {
              let ReducerProduct = {
                TRD_DSC_KEYINV: productReducer.Data[i].TRD_DSC_KEYINV,
                TRD_C_DSCV: productReducer.Data[i].TRD_C_DSCV,
                TRD_OPTION: productReducer.Data[i].TRD_OPTION,
                TRD_KEYIN: productReducer.Data[i].TRD_KEYIN,
                SKU_KEY: productReducer.Data[i].SKU_KEY,
                SKU_NAME: productReducer.Data[i].SKU_NAME,
                UTQ_NAME: productReducer.Data[i].UTQ_NAME,
                TRD_QTY: sumTRD_QTY(productReducer.Data[i].TRD_QTY, tempData.TRD_QTY).toString(),
                onSave: true,
                onFocusQTY: false,
                onFocusTRD_K_U_PRC: false,
                date_in: productReducer.Data[i].date_in,
                Temp_TRD_K_U_PRC: productReducer.Data[i].Temp_TRD_K_U_PRC,
                TRD_K_U_PRC: productReducer.Data[i].TRD_K_U_PRC,
                Temp_ARPLU_U_PRC: productReducer.Data[i].Temp_ARPLU_U_PRC,
                TRD_DSC_KEYIN: productReducer.Data[i].TRD_DSC_KEYIN,
                TRD_Q_FREE: productReducer.Data[i].TRD_Q_FREE,
                TRD_WL: productReducer.Data[i].TRD_WL,
                TRD_TO_WL: productReducer.Data[i].TRD_TO_WL,
                TRD_U_VATIO: productReducer.Data[i].TRD_U_VATIO,
              }
              tempReducer.push(ReducerProduct)
              c = false
            } else if (productReducer.Data[i].TRD_KEYIN == tempData.TRD_KEYIN && productReducer.Data[i].TRD_K_U_PRC != tempData.TRD_K_U_PRC && productReducer.Data[i].onSave == true) {
              tempReducer.push(productReducer.Data[i])

            } else if (productReducer.Data[i].TRD_KEYIN != tempData.TRD_KEYIN && productReducer.Data[i].onSave == true) {
              tempReducer.push(productReducer.Data[i])
            }
          }
        }
        if (c) {
          let ReducerProduct = {
            TRD_DSC_KEYINV: tempData.TRD_DSC_KEYINV,
            TRD_C_DSCV: tempData.TRD_C_DSCV,
            TRD_OPTION: tempData.TRD_OPTION,
            TRD_KEYIN: tempData.TRD_KEYIN,
            SKU_KEY: tempData.SKU_KEY,
            SKU_NAME: tempData.SKU_NAME,
            UTQ_NAME: tempData.UTQ_NAME,
            TRD_QTY: tempData.TRD_QTY,
            onSave: true,
            onFocusQTY: tempData.onFocusQTY,
            onFocusTRD_K_U_PRC: tempData.onFocusTRD_K_U_PRC,
            date_in: tempData.date_in,
            Temp_TRD_K_U_PRC: tempData.Temp_TRD_K_U_PRC,
            TRD_K_U_PRC: tempData.TRD_K_U_PRC,
            Temp_ARPLU_U_PRC: tempData.Temp_ARPLU_U_PRC,
            TRD_DSC_KEYIN: tempData.TRD_DSC_KEYIN,
            TRD_Q_FREE: tempData.TRD_Q_FREE,
            TRD_WL: tempData.TRD_WL,
            TRD_TO_WL: tempData.TRD_TO_WL,
            TRD_U_VATIO: tempData.TRD_U_VATIO,
          }
          tempReducer.push(ReducerProduct)
        }

        for (var i in GOODSMASTER) {
          if (i != parseInt(index) && GOODSMASTER[i].onSave == false) tempReducer.push(GOODSMASTER[i])
        }



        const newArray = [];
        tempReducer.forEach(obj => {
          if (!newArray.some(o => o === obj)) {
            uniqueArray.push({ ...obj })
            unique.push({ ...obj })
          }
        })
        unique.sort((a, b) => {
          if (a.date_in > b.date_in) {
            return 1;
          }
          if (a.date_in < b.date_in) {
            return -1;
          }
          return 0;
        });
        dispatch(productActions.setData(uniqueArray))
        setGOODSMASTER(unique)
      }

    }
  }
  const set_SkuG = async () => {
    setLoading(true)
    let temp_array = GOODSMASTER;
    let newProduct = {
      TRD_DSC_KEYINV: '0.00',
      TRD_C_DSCV: '0.00',
      TRD_OPTION: '',
      TRD_KEYIN: PRODUCTMASTER.GOODS_CODE,
      SKU_KEY: SKUMASTER.SKU_KEY,
      SKU_NAME: SKUMASTER.SKU_NAME,
      UTQ_NAME: PRODUCTMASTER.UTQ_NAME,
      onSave: false, TRD_QTY: PRODUCTMASTER.UTQ_QTY,
      onFocusQTY: PRODUCTMASTER.onFocusQTY,
      onFocusTRD_K_U_PRC: PRODUCTMASTER.onFocusTRD_K_U_PRC,
      date_in: PRODUCTMASTER.date_in,
      Temp_TRD_K_U_PRC: PRODUCTMASTER.ARPLU_U_PRC,
      TRD_K_U_PRC: 0,
      Temp_ARPLU_U_PRC: PRODUCTMASTER.ARPLU_U_PRC,
      TRD_DSC_KEYIN: '0',
      TRD_Q_FREE: '0',
      TRD_WL: "HO.NA",
      TRD_TO_WL: "HO.NA",
      TRD_U_VATIO: '1'
    }
    temp_array.push(newProduct)
    setGOODS_CODE('');
    setTemp_report('');
    setPRODUCTMASTER({})
    setSKUMASTER([])
    let tempSum = 0
    for (var i in temp_array)
      tempSum += temp_array[i].TRD_QTY * temp_array[i].TRD_K_U_PRC
    console.log(tempSum)
    setSum(tempSum)
    setGOODSMASTER(temp_array)

    setLoading(false)
  }
  const regisMacAdd = async (urlser, serviceID, machineNum, userNameED, passwordED) => {
    console.log(serviceID)
    let tempGuid = await safe_Format._fetchGuidLog(urlser, serviceID, machineNum, userNameED, passwordED)
    await dispatch(loginActions.guid(tempGuid))
    fetchMotherData(tempGuid)
  };

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
      .then(async (json) => {
        let responseData = JSON.parse(json.ResponseData);

        if (responseData.RECORD_COUNT > 0) {

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


          responseData.GOODSMASTER = responseData.GOODSMASTER.filter((item) => { return (item.GOODS_CODE == fetchBarcodeData) })[0]
          await fetch('http://worldtimeapi.org/api/timezone/Asia/Bangkok', {
            method: 'GET'
          })
            .then((response) => response.json())
            .then((json) => {
              let datetime = json.utc_datetime
              console.log()
              console.log('>')
              console.log(datetime)
              console.log()

              let newGoodobj = {
                GOODS_KEY: responseData.GOODSMASTER.GOODS_KEY ? responseData.GOODSMASTER.GOODS_KEY : '',
                GOODS_CODE: responseData.GOODSMASTER.GOODS_CODE ? responseData.GOODSMASTER.GOODS_CODE : '',
                GOODS_SKU: responseData.GOODSMASTER.GOODS_SKU ? responseData.GOODSMASTER.GOODS_SKU : '',
                GOODS_PRICE: responseData.GOODSMASTER.GOODS_PRICE ? responseData.GOODSMASTER.GOODS_PRICE : '',
                GOODS_ALIAS: responseData.GOODSMASTER.GOODS_ALIAS ? responseData.GOODSMASTER.GOODS_ALIAS : '',
                GOODS_E_ALIAS: responseData.GOODSMASTER.GOODS_E_ALIAS ? responseData.GOODSMASTER.GOODS_E_ALIAS : '',
                GOODS_BARTYPE: responseData.GOODSMASTER.GOODS_BARTYPE ? responseData.GOODSMASTER.GOODS_BARTYPE : '',
                UTQ_NAME: responseData.GOODSMASTER.UTQ_NAME ? responseData.GOODSMASTER.UTQ_NAME : '',
                UTQ_QTY: '1',
                onSave: false, Temp_ARPLU_U_PRC: responseData.GOODSMASTER.ARPLU_U_PRC ? responseData.GOODSMASTER.ARPLU_U_PRC : '',
                onFocusQTY: false,
                onFocusTRD_K_U_PRC: false,
                date_in: new Date(datetime),
                ARPLU_U_PRC: responseData.GOODSMASTER.ARPLU_U_PRC ? responseData.GOODSMASTER.ARPLU_U_PRC : '',
                ARPLU_U_DSC: responseData.GOODSMASTER.ARPLU_U_DSC ? responseData.GOODSMASTER.ARPLU_U_DSC : '',
                TAG_CODE: responseData.GOODSMASTER.TAG_CODE ? responseData.GOODSMASTER.TAG_CODE : '01',
                TAG_NAME: responseData.GOODSMASTER.TAG_NAME ? responseData.GOODSMASTER.TAG_NAME : ''
              }
              setPRODUCTMASTER(newGoodobj)
            })
            .catch((error) => {
              console.log(ser_die)
              console.error('ERROR at fetchContent >> ' + error)
            })




          setSKUMASTER(newSkuobj)
        } else {
          setPRODUCTMASTER({})
          setSKUMASTER([])
          setTemp_report(Language.t('alert.errorDetail'));
          // AddNewData(fetchBarcodeData)

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
        .then(async (json) => {
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

            console.log()
            console.log()
            responseData.GOODSMASTER = responseData.GOODSMASTER.filter((item) => { return (item.GOODS_CODE == GOODS_CODE) })[0]
            await fetch('http://worldtimeapi.org/api/timezone/Asia/Bangkok', {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((json) => {
                let datetime = json.utc_datetime
                console.log()
                console.log('>')
                console.log(datetime)
                console.log()
                let newGoodobj = {
                  GOODS_KEY: responseData.GOODSMASTER.GOODS_KEY ? responseData.GOODSMASTER.GOODS_KEY : '',
                  GOODS_CODE: responseData.GOODSMASTER.GOODS_CODE ? responseData.GOODSMASTER.GOODS_CODE : '',
                  GOODS_SKU: responseData.GOODSMASTER.GOODS_SKU ? responseData.GOODSMASTER.GOODS_SKU : '',
                  GOODS_PRICE: responseData.GOODSMASTER.GOODS_PRICE ? responseData.GOODSMASTER.GOODS_PRICE : '',
                  GOODS_ALIAS: responseData.GOODSMASTER.GOODS_ALIAS ? responseData.GOODSMASTER.GOODS_ALIAS : '',
                  GOODS_E_ALIAS: responseData.GOODSMASTER.GOODS_E_ALIAS ? responseData.GOODSMASTER.GOODS_E_ALIAS : '',
                  GOODS_BARTYPE: responseData.GOODSMASTER.GOODS_BARTYPE ? responseData.GOODSMASTER.GOODS_BARTYPE : '',
                  UTQ_NAME: responseData.GOODSMASTER.UTQ_NAME ? responseData.GOODSMASTER.UTQ_NAME : '',
                  UTQ_QTY: '1',
                  onSave: false, Temp_ARPLU_U_PRC: responseData.GOODSMASTER.ARPLU_U_PRC ? responseData.GOODSMASTER.ARPLU_U_PRC : '',
                  onFocusQTY: false,
                  onFocusTRD_K_U_PRC: false,
                  date_in: new Date(datetime),
                  ARPLU_U_PRC: responseData.GOODSMASTER.ARPLU_U_PRC ? responseData.GOODSMASTER.ARPLU_U_PRC : '',
                  ARPLU_U_DSC: responseData.GOODSMASTER.ARPLU_U_DSC ? responseData.GOODSMASTER.ARPLU_U_DSC : '',
                  TAG_CODE: responseData.GOODSMASTER.TAG_CODE ? responseData.GOODSMASTER.TAG_CODE : '01',
                  TAG_NAME: responseData.GOODSMASTER.TAG_NAME ? responseData.GOODSMASTER.TAG_NAME : ''
                }
                console.log('newGoodobj>> ', newGoodobj.GOODS_KEY)
                setPRODUCTMASTER(newGoodobj)
              })
              .catch((error) => {
                console.log(ser_die)
                console.error('ERROR at fetchContent >> ' + error)
              })


            setSKUMASTER(newSkuobj)
            setLoading(false)
          } else {
            setSKUMASTER([])
            setPRODUCTMASTER({})
            setTemp_report(Language.t('alert.errorDetail'));
            // AddNewData()

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
      setPRODUCTMASTER({})
      Alert.alert(Language.t('alert.errorTitle'), Language.t('alert.incompleteInformation'), [{
        text: Language.t('alert.ok'), onPress: () => { }
      }]);
      setLoading(false)
      setCountdown(-1)
    }

  }
  const CpushData = async () => {

    await fetch('http://worldtimeapi.org/api/timezone/Asia/Bangkok', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then(async (json) => {
        let datetime = json.utc_datetime
        console.log()
        console.log('> datetime')
        console.log(datetime)
        console.log()
        let C = false
        for (var i in GOODSMASTER) {
          if (GOODSMASTER[i].TRD_K_U_PRC == 0 || GOODSMASTER[i].TRD_K_U_PRC == '') {
            C = true
            break
          }
          console.log(GOODSMASTER[i].TRD_K_U_PRC)
        }
        if (productReducer.Log_data.date) {
          var inputyear = Number(productReducer.Log_data.date.substring(0, 4)) + 543
          var inputmonths = productReducer.Log_data.date.substring(4, 6)
          var inputdate = productReducer.Log_data.date.substring(6, 8)
          var inputFullDate = inputdate + '/' + inputmonths + '/' + inputyear
          console.log(C)
          if (C) {
            console.log(DI_REF.DI_REF)
            Alert.alert(Language.t('menu.alertsave0Message'), Language.t('menu.alertsaveMessage'), [{
              text: Language.t('alert.ok'), onPress: () => DI_REF.DI_REF != '<เลขถัดไป>' ? Alert.alert(Language.t('notiAlert.header'), `เมื่อวันที่ ${inputFullDate} เวลา ${productReducer.Log_data.time}น. มีการบันทึกเอกสารไปแล้ว\nคุณต้องการแก้ไขหรือไม่`,
                [
                  { text: Language.t('alert.ok'), onPress: () => { pushData(datetime) } },
                  { text: Language.t('alert.cancel'), onPress: () => { on_cancel() } }

                ]) : pushData(datetime)
            }, { text: Language.t('alert.cancel'), onPress: () => { } }])
          } else {
            if (DI_REF.DI_REF != '<เลขถัดไป>') {
              Alert.alert(Language.t('notiAlert.header'), `เมื่อวันที่ ${inputFullDate} เวลา ${productReducer.Log_data.time}น. มีการบันทึกเอกสารไปแล้ว\nคุณต้องการแก้ไขหรือไม่`,
                [
                  { text: Language.t('alert.ok'), onPress: () => { pushData(datetime) } },
                  { text: Language.t('alert.cancel'), onPress: () => { on_cancel() } }

                ])

            } else
              pushData(datetime)
          }
        } else
          pushData(datetime)
      })
      .catch((error) => {
        console.log(ser_die)
        console.error('ERROR at fetchContent >> ' + error)
      })


  }
  const pushData = async (datetime) => {
    dieSer('pushData')
    setLoading(true)
    console.log(databaseReducer.Data.urlser)

    var x = new Date(datetime)
    let yesr = x.getFullYear().toString()
    let month = (x.getMonth() + 1).toString().length > 1 ? (x.getMonth() + 1).toString() : '0' + (x.getMonth() + 1).toString()
    let date = x.getDate().toString().length > 1 ? x.getDate().toString() : '0' + x.getDate().toString()
    let fullDay = yesr + month + date
    let fullTime = x.toLocaleTimeString().substring(0, 5)
    let TRH_SHIP_DATE = yesr + month + date + '0000'
    yesr = (x.getFullYear() + 1).toString()
    let TRH_CANCEL_DATE = yesr + month + date + '0000'
    console.log(TRH_SHIP_DATE)
    console.log(TRH_CANCEL_DATE)
    console.log(JSON.stringify(GOODSMASTER))
    let TempProduct = []
    let temp_good = '';
    let temp_GOODSMASTER = []

    console.log()

    console.log()
    for (var i in GOODSMASTER)
      if (GOODSMASTER[i].TRD_QTY > 0) temp_GOODSMASTER.push(GOODSMASTER[i])
    for (var i in temp_GOODSMASTER) {
      if (i > 0) temp_good += ','
      temp_good += '{' +
        '\"TRD_DSC_KEYINV\":\"' + temp_GOODSMASTER[i].TRD_DSC_KEYINV +
        '\",\" TRD_C_DSCV\":\"' + temp_GOODSMASTER[i].TRD_C_DSCV +
        '\",\"TRD_OPTION\":\"' + temp_GOODSMASTER[i].TRD_OPTION +
        '\",\"TRD_KEYIN\":\"' + temp_GOODSMASTER[i].TRD_KEYIN +
        '\",\"SKU_KEY\":\"' + temp_GOODSMASTER[i].SKU_KEY +
        '\",\"SKU_NAME\":\"' + temp_GOODSMASTER[i].SKU_NAME +
        '\",\"UTQ_NAME\":\"' + temp_GOODSMASTER[i].UTQ_NAME +
        '\",\"TRD_QTY\":\"' + temp_GOODSMASTER[i].TRD_QTY +
        '\",\"TRD_K_U_PRC\":\"' + temp_GOODSMASTER[i].TRD_K_U_PRC +
        '\",\"TRD_DSC_KEYIN\":\"' + temp_GOODSMASTER[i].TRD_DSC_KEYIN +
        '\",\"TRD_Q_FREE\":\"' + temp_GOODSMASTER[i].TRD_Q_FREE +
        '\",\"TRD_WL\":\"' + temp_GOODSMASTER[i].TRD_WL +
        '\",\"TRD_TO_WL\":\"' + temp_GOODSMASTER[i].TRD_TO_WL +
        '\",\"TRD_U_VATIO\":\"' + temp_GOODSMASTER[i].TRD_U_VATIO +
        '\"}'
    }
    console.log(temp_good)
    await fetch(databaseReducer.Data.urlser + '/UpdateErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'SaveReceiveDocinfo',
        'BPAPUS-PARAM': '{\"ErpUpdFunc\":[{\"ImpTrhHeader\":{' +
          '\"DI_DATE\":\"' + TRH_SHIP_DATE +
          '\",\"DI_REF\":\"' + DI_REF.DI_REF +
          '\",\"DT_DOCCODE\":\"IB' +
          '\",\"DT_PROPERTIES\":\"303' +
          '\",\"VAT_DATE\":\"' + TRH_SHIP_DATE +
          '\",\"VAT_REF\":\"' + DI_REF.INFO +
          '\",\"VAT_RATE\":\"7' +
          '\",\"VAT_RFR_REF\":\"' + DI_REF.INFO +
          '\",\"TRH_SHIP_DATE\":\"' + TRH_SHIP_DATE +
          '\",\"TRH_CANCEL_DATE\":\"' + TRH_CANCEL_DATE +
          '\",\"DEPT_CODE\":\"03' +
          '\",\"PRJ_CODE\":\"' +
          '\",\"AP_CODE\":\"001' +
          '\",\"APD_APCD\":\"101' +
          '\",\"APPRB_CODE\":\"1' +
          '\",\"APD_TDSC_KEYIN\":\"0' +
          '\",\"APD_DUE_DA\":\"' + TRH_SHIP_DATE +
          '\"},\"ImpTrhDetail\":[' +
          temp_good +
          ']}]}',
        "BPAPUS-FILTER": "",
        "BPAPUS-ORDERBY": "",
        "BPAPUS-OFFSET": "0",
        "BPAPUS-FETCH": "0"
      })
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == '200') {
          let temp_array = []
          for (var i in GOODSMASTER) {

            let newProduct = {
              TRD_DSC_KEYINV: GOODSMASTER[i].TRD_DSC_KEYINV,
              TRD_C_DSCV: GOODSMASTER[i].TRD_C_DSCV,
              TRD_OPTION: GOODSMASTER[i].TRD_OPTION,
              TRD_KEYIN: GOODSMASTER[i].TRD_KEYIN,
              SKU_KEY: GOODSMASTER[i].SKU_KEY,
              SKU_NAME: GOODSMASTER[i].SKU_NAME,
              UTQ_NAME: GOODSMASTER[i].UTQ_NAME,
              TRD_QTY: GOODSMASTER[i].TRD_QTY,
              onSave: true,
              onFocusQTY: false,
              onFocusTRD_K_U_PRC: false,
              date_in: GOODSMASTER[i].date_in,
              Temp_TRD_K_U_PRC: GOODSMASTER[i].Temp_TRD_K_U_PRC,
              TRD_K_U_PRC: GOODSMASTER[i].TRD_K_U_PRC,
              Temp_ARPLU_U_PRC: GOODSMASTER[i].Temp_ARPLU_U_PRC,
              TRD_DSC_KEYIN: GOODSMASTER[i].TRD_DSC_KEYIN,
              TRD_Q_FREE: GOODSMASTER[i].TRD_Q_FREE,
              TRD_WL: GOODSMASTER[i].TRD_WL,
              TRD_TO_WL: GOODSMASTER[i].TRD_TO_WL,
              TRD_U_VATIO: GOODSMASTER[i].TRD_U_VATIO,
            }
            temp_array.push(newProduct)

          }
          let responseData = JSON.parse(json.ResponseData);
          console.log()
          console.log('responseData > ', responseData)
          console.log()
          let Log_data = {
            DI_KEY: responseData.DI_KEY,
            GOODSMASTER: temp_array,
            date: fullDay,
            time: fullTime
          }

          console.log('Log_data >> ', Log_data)
          console.log()
          await dispatch(productActions.setLog_Data(Log_data))
          Alert.alert(Language.t('alert.succeed'), `เพิ่มเอกสารรับสินค้า สำเร็จ `, [{
            text: Language.t('alert.ok'), onPress: () => { navigation.goBack() }
          }]);
        }
        else Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.incorrect'), [{
            text: Language.t('alert.ok'), onPress: () => { }
          }]);
        console.log(json)
        setLoading(false)
        on_clear()
        setCountdown(-1)
      })
      .catch((error) => {
        console.log('Function Parameter Required');
      })



  }
  return (
    <View style={container1}>
      <StatusBar hidden={true} />
      <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={{
        flex: 1,
        paddingTop: PRODUCTMASTER.GOODS_KEY ? deviceHeight * 0.07 : deviceHeight * 0.2,
      }}>

        {!loading_backG ? <>
          <View style={tabbar} >
            <View style={{
              backgroundColor: '#fff', alignSelf: 'center',
              justifyContent: 'center', borderRadius: 20, flexDirection: 'row', marginBottom: 10,
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

              <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, }} onPress={() => fetchMotherData()}>
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
              <TouchableOpacity style={{ padding: 5, }} onPress={() => on_scan()}>
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
              justifyContent: 'center', borderRadius: 20, flexDirection: 'row',
            }}>
              <Text
                style={{
                  flex: 8,
                  borderBottomColor: Colors.borderColor,
                  color: Colors.fontColor,
                  padding: 10,
                  fontSize: 30,
                  textAlign: 'center'
                }}>
                {Temp_report ? Temp_report : ' '}
              </Text>
            </View>
          </View>
          {PRODUCTMASTER.GOODS_KEY && (
            <View style={{ alignItems: 'flex-end', marginTop: 5 }}>
              <TouchableOpacity onPress={() => Alert.alert('', 'ต้องการเพิ่มรายการรับสินค้า ?', [{ text: Language.t('selectBase.yes'), onPress: () => set_SkuG() }, { text: Language.t('selectBase.no'), onPress: () => { } }])}>
                <Image
                  style={{ height: deviceWidth * 0.2, width: deviceWidth * 0.3 }}
                  resizeMode={'contain'}
                  source={require('../images/UI/Menu/add.png')}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: deviceHeight - deviceHeight * 0.6 }}>
            <KeyboardAvoidingView keyboardVerticalOffset={1}>
              <ScrollView horizontal={true} >

                <View style={styles.body}>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <View style={{ flex: 0.3, padding: 10, justifyContent: 'center' }}  >
                        <Text style={{
                          fontSize: FontSize.medium,
                          color: Colors.backgroundColorSecondary,
                          fontWeight: 'bold'
                        }}> {Language.t('main.code')}</Text></View>
                      <View style={{ flex: 0.1, padding: 10, justifyContent: 'center' }}  >
                        <Text style={{
                          fontSize: FontSize.medium,
                          color: Colors.backgroundColorSecondary,
                          fontWeight: 'bold'
                        }}>{Language.t('main.unit')}</Text></View>
                      <View style={{ flex: 0.6, backgroundColor: Colors.tableProD, flexDirection: 'row', borderTopEndRadius: 15, }}>
                        <View style={{ flex: 0.3, padding: 10, justifyContent: 'center', }} >
                          <Text style={{
                            fontSize: FontSize.medium,
                            color: Colors.backgroundColorSecondary,
                            alignSelf: 'flex-end',
                            fontWeight: 'bold'
                          }}> จำนวน </Text></View>
                        <View style={{ flex: 0.3, padding: 10, justifyContent: 'center', }} >
                          <Text style={{
                            fontSize: FontSize.medium,
                            alignSelf: 'flex-end',
                            color: Colors.backgroundColorSecondary,
                            fontWeight: 'bold'
                          }}> ราคาซื้อ </Text></View>
                        <View style={{ flex: 0.3, padding: 10, justifyContent: 'center', }} >
                          <Text style={{
                            fontSize: FontSize.medium,
                            alignSelf: 'flex-end',
                            color: Colors.backgroundColorSecondary,
                            fontWeight: 'bold'
                          }}> ราคาขาย </Text></View>

                        <View style={{ padding: 10, flex: 0.1, }}>
                          <View
                            style={{ height: FontSize.large * 1.5, width: FontSize.large * 1.5, }}
                          ></View>
                        </View>
                      </View>


                    </View>
                    <ScrollView
                      ref={scrollViewRef}
                      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
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
                          {GOODSMASTER.map((item, index) => {
                            return (
                              <View style={styles.tableView}>
                                <View style={{
                                  color: Colors.fontColor,
                                  fontSize: FontSize.medium,
                                  justifyContent: 'center',
                                  flex: 0.3,
                                }}><Text
                                  style={{
                                    color: Colors.fontColor,
                                    fontSize: FontSize.medium,
                                  }}
                                >{item.TRD_KEYIN}</Text>
                                  <Text
                                    style={{
                                      color: Colors.fontColor,
                                      fontSize: FontSize.medium,
                                    }}
                                  >{item.SKU_NAME}</Text>
                                </View>
                                <View style={{
                                  color: Colors.fontColor,
                                  fontSize: FontSize.medium,
                                  justifyContent: 'center',
                                  flex: 0.1, padding: 10
                                }}>
                                  <Text
                                    style={{
                                      color: Colors.fontColor,
                                    }}
                                  >{item.onFocusQTY == false || item.onFocusTRD_K_U_PRC == false ? item.UTQ_NAME : `${item.UTQ_NAME} ( ${item.Temp_TRD_K_U_PRC > 0 ? item.Temp_TRD_K_U_PRC : 0} )`}</Text>
                                </View>
                                <View style={{ flex: 0.6, flexDirection: 'row' }}>
                                  <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,
                                    flex: 0.3, padding: 10
                                  }}>
                                    {item.onSave == true ?
                                      <CurrencyInput
                                        style={{ color: Colors.tableProD }}
                                        editable={false}
                                        delimiter=","
                                        separator="."
                                        precision={0}
                                        keyboardType="number-pad"
                                        placeholderTextColor={Colors.fontColorSecondary}
                                        value={item.TRD_QTY}
                                        multiline={true}
                                        textAlign={'right'}
                                        placeholder={Language.t('main.pprice') + '..'}
                                        onPress={() => {
                                          set_Focus('QTY', true, index)
                                        }}
                                      />
                                      : item.onFocusQTY == true ? <>
                                        <TextInput
                                          style={{
                                            color: Colors.fontColor,
                                            fontSize: FontSize.medium,
                                            borderBottomColor: Colors.tableProD,
                                            borderBottomWidth: 1,
                                          }}
                                          keyboardType="number-pad"
                                          placeholderTextColor={Colors.fontColorSecondary}
                                          value={0}
                                          textAlign={'right'}
                                          placeholder={'จำนวน ..'}
                                          onBlur={() => set_Focus('QTY', false, index)}
                                          onChangeText={(val) => {
                                            set_SkuTRD_QTY(val, index)
                                          }}
                                        />
                                      </> : <>
                                        <TextInput
                                          style={{
                                            color: Colors.fontColor,
                                            fontSize: FontSize.medium,
                                            borderBottomColor: Colors.tableProD,
                                            borderBottomWidth: 1,
                                          }}
                                          keyboardType="number-pad"
                                          placeholderTextColor={Colors.fontColorSecondary}
                                          value={item.TRD_QTY}
                                          textAlign={'right'}
                                          placeholder={'จำนวน ..'}
                                          onFocus={() => set_Focus('QTY', true, index)}
                                          onChangeText={(val) => {
                                            set_SkuTRD_QTY(val, index)
                                          }}
                                        />
                                      </>}
                                  </View>
                                  <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,
                                    flex: 0.3, padding: 10
                                  }}>
                                    {item.onSave == true ?
                                      <CurrencyInput
                                        style={{ color: Colors.tableProD }}
                                        editable={false}
                                        delimiter=","
                                        separator="."
                                        precision={2}
                                        keyboardType="number-pad"
                                        placeholderTextColor={Colors.fontColorSecondary}
                                        value={item.TRD_K_U_PRC}
                                        multiline={true}
                                        textAlign={'right'}
                                        placeholder={Language.t('main.pprice') + '..'}
                                        onFocus={() => {
                                          set_Focus('TRD', true, index)
                                        }}
                                      />
                                      : item.onFocusTRD_K_U_PRC == false ? <>
                                        <TextInput
                                          style={{
                                            color: Colors.fontColor,
                                            fontSize: FontSize.medium,
                                            borderBottomColor: Colors.tableProD,
                                            borderBottomWidth: 1,
                                          }}
                                          keyboardType="number-pad"
                                          placeholderTextColor={Colors.fontColorSecondary}
                                          value={item.TRD_K_U_PRC}
                                          textAlign={'right'}
                                          placeholder={Language.t('main.pprice') + '..'}
                                          onFocus={() => set_Focus('TRD', true, index)}
                                          onChangeText={(val) => {
                                            console.log(val)
                                          }}
                                        />
                                      </> : <>
                                        <TextInput
                                          style={{
                                            color: Colors.fontColor,
                                            fontSize: FontSize.medium,
                                            borderBottomColor: Colors.tableProD,
                                            borderBottomWidth: 1,
                                          }}
                                          keyboardType="number-pad"
                                          placeholderTextColor={Colors.fontColorSecondary}
                                          value={0}
                                          textAlign={'right'}
                                          placeholder={Language.t('main.pprice') + '..'}
                                          onBlur={() => set_Focus('TRD', false, index)}
                                          onChangeText={(val) => {
                                            set_SkuP(val, index)
                                          }}
                                        />
                                      </>}
                                  </View>
                                  <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,
                                    flex: 0.3, padding: 10
                                  }}>
                                    <CurrencyInput
                                      style={{ color: Colors.tableProD }}
                                      editable={false}
                                      delimiter=","
                                      separator="."
                                      precision={2}
                                      keyboardType="number-pad"
                                      placeholderTextColor={Colors.fontColorSecondary}
                                      value={item.Temp_TRD_K_U_PRC}
                                      multiline={true}
                                      textAlign={'right'}
                                      placeholder={Language.t('main.pprice') + '..'}
                                      onPress={() => {
                                        set_Focus('TRD', true, index)
                                      }}
                                    />
                                  </View>

                                  {item.onSave == true ?
                                    <TouchableOpacity style={{ flex: 0.1, padding: 10, }} onPress={() => pop_saveSku(item, index)}>

                                      <Image
                                        style={{ height: FontSize.large * 1.5, width: FontSize.large * 1.5, }}
                                        resizeMode={'contain'}
                                        source={require('../images/UI/Menu/edit.png')}
                                      />

                                    </TouchableOpacity> : <TouchableOpacity style={{ flex: 0.1, padding: 10, }} onPress={() => set_saveSku(item, index)}>

                                      <Image
                                        style={{ height: FontSize.large * 1.5, width: FontSize.large * 1.5, }}
                                        resizeMode={'contain'}
                                        source={require('../images/UI/Menu/save.png')}
                                      />

                                    </TouchableOpacity>}
                                </View>

                              </View>
                            )
                          })}
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
                        </>)}
                    </ScrollView>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

          </View>

          <View style={{
            position: 'absolute',

            justifyContent: 'center',
            flexDirection: "row",

            left: 0,
            top: deviceHeight - deviceHeight * 0.2,
            width: deviceWidth,

          }}>

            {GOODSMASTER.length > 0 && (
              <View style={{
                justifyContent: 'center',
                flexDirection: "row",
              }}>
                <View style={{ width: deviceWidth / 2.2, backgroundColor: Colors.borderColor, padding: 10, margin: 5, borderRadius: 20, }}>
                  <View style={{
                    alignSelf: 'flex-start',
                    color: Colors.fontColor2,
                    fontSize: FontSize.medium,

                  }}>

                    <Text style={{
                      color: Colors.fontColor2,
                      fontSize: FontSize.medium,

                    }}>
                      {`รวมชนิดสินค้า `}

                    </Text>
                    <Text style={{
                      color: Colors.fontColor2,
                      fontSize: FontSize.medium,

                    }}>
                      {`${GOODSMASTER.length} รายการ`}

                    </Text>
                  </View>

                </View>
                <View style={{ width: deviceWidth / 2.2, backgroundColor: Colors.buttonColorPrimary, padding: 10, margin: 5, borderRadius: 20, }}>
                  <View style={{
                    alignSelf: 'flex-start',
                    color: Colors.fontColor2,
                    fontSize: FontSize.medium,

                  }}>

                    <Text style={{
                      color: Colors.fontColor2,
                      fontSize: FontSize.medium,

                    }}>
                      {`รวมเงิน`}

                    </Text>
                    <Text style={{
                      color: Colors.fontColor2,
                      fontSize: FontSize.medium,

                    }}>
                      {`${currencyFormat(sum) != 'NaN' ? currencyFormat(sum) : '-'} บาท`}

                    </Text>
                  </View>

                </View>
              </View>)}
          </View>
          <View style={styles.footer}>

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
            <TouchableOpacity style={{ padding: 10, }} onPress={() => Alert.alert('', 'เพิ่มเอกสารรับสินค้า ?', [{ text: Language.t('alert.ok'), onPress: () => CpushData() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}>
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
            <TouchableOpacity style={{ padding: 10, }} onPress={() => on_clear()}>
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
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    width: deviceWidth * 2,
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
    top: deviceHeight - deviceHeight * 0.1,
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
    paddingTop: deviceHeight * 0.2

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
export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);