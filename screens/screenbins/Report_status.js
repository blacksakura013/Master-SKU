// import React, { useState, useEffect } from 'react';
// import {
//     StyleSheet,
//     View,
//     TextInput,
//     Dimensions,
//     Text,
//     Platform,
//     Image,
//     ImageBackground,
//     ActivityIndicator,
//     Alert,
//     StatusBar,
//     KeyboardAvoidingView,
//     BackHandler,
//     ScrollView,
//     TouchableNativeFeedback,
//     TouchableOpacity,

//     Pressable,
// } from 'react-native';
// import CurrencyInput from 'react-native-currency-input';
// import { Picker, } from 'native-base';
// import { useStateIfMounted } from 'use-state-if-mounted';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import RNRestart from 'react-native-restart';

// import { connect } from 'react-redux';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Colors from '../../src/Colors';
// import { useSelector, useDispatch } from 'react-redux';
// import { FontSize } from '../../components/FontSizeHelper';
// import { useNavigation } from '@react-navigation/native';
// import DatePicker from 'react-native-datepicker'
// // import { View } from 'react-native-paper';

// import Dialog from 'react-native-dialog';
// import { Language } from '../../translations/I18n';
// import DeviceInfo from 'react-native-device-info';
// import RNFetchBlob from 'rn-fetch-blob';
// const deviceWidth = Dimensions.get('window').width;
// const deviceHeight = Dimensions.get('window').height;
// var ser_die = true
// import * as loginActions from '../../src/actions/loginActions';
// import * as registerActions from '../../src/actions/registerActions';
// import * as databaseActions from '../../src/actions/databaseActions';
// import * as activityActions from '../../src/actions/activityActions';
// import safe_Format from '../../src/safe_Format';
// import { fontWeight, height, margin } from 'styled-system';
// import { Input } from 'antd';
// import { Header } from 'react-navigation-stack';
// const Report_status = ({ route }) => {
//     let arrayResult = [];
//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//     const {
//         container2,
//         container1,
//         button,
//         textButton,
//         topImage,
//         tabbar,
//         buttonContainer,
//     } = styles;

//     const loginReducer = useSelector(({ loginReducer }) => loginReducer);
//     const registerReducer = useSelector(({ registerReducer }) => registerReducer);
//     const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
//     const activityReducer = useSelector(({ activityReducer }) => activityReducer);

//     const [selectedValue, setSelectedValue] = useState('');
//     const [GETPRINTSTATUS, setGETPRINTSTATUS] = useState([]);
//     const [selectlanguage, setlanguage] = useState('thai');
//     const [GOODS_CODE, setGOODS_CODE] = useState('');
//     const [Temp_report, setTemp_report] = useState('');

//     const [isShowDialog, setShowDialog] = useState(false);
//     const [loading, setLoading] = useStateIfMounted(false);
//     const [loading_backG, setLoading_backG] = useStateIfMounted(true);
//     const [machineNo, setMachineNo] = useState('');
//     const [open, setOpen] = useState(false);
//     const [value, setValue] = useState(null);
//     const [printItem, setPrintItem] = useState({});

//     const [start_date, setS_date] = useState(new Date());
//     const [end_date, setE_date] = useState(new Date())

//     const [isSFeatures, setSFeatures] = useState(loginReducer.isSFeatures == true ? '\"Y\"' : '\"N\"');

//     const image = '../../images/UI/SKU/4x/Asset22_4x.png';
//     let clockCall = null;
//     const defaultCountDown = -1;
//     const [modalVisible, setModalVisible] = useState(false);
//     const [countdown, setCountdown] = useState(defaultCountDown);
//     const [recon, setRecon] = useState('');

//     let kye_token = "";
//     const months_th_mini = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",];


//     useEffect(() => {
//         console.log('>> Address : ', loginReducer.ipAddress)
//         console.log('>> isSFeatures : ', loginReducer.isSFeatures, isSFeatures)
//         console.log(`>> loginReducer.endpointMother ${loginReducer.endpointMother}`)
//     }, []);

//     useEffect(() => {
//         resetPRINTSTATUS()

//         console.log('RPTSVR_DATA', activityReducer.RPTSVR_DATA.length)
//     }, []);

//     const resetPRINTSTATUS = async () => {


//         await fetchData()
//         await setCountdown(35)


//     }
//     const decrementClock = () => {
//         if (countdown === 0) {

//             setCountdown(0);
//             clearInterval(clockCall);
//         } else {
//             setCountdown(countdown - 1);
//         }
//     };

//     const on_cancel = () => {

//     }

//     useEffect(() => {
//         if (countdown === 0) {
//             Alert.alert(
//                 Language.t('alert.errorTitle'),
//                 Language.t('selectBase.UnableConnec'), [{ text: Language.t('selectBase.connectAgain'), onPress: () => connectAgain() }, { text: Language.t('main.cancel'), onPress: () => BackHandler.exitApp() }]);
//         } else if (countdown === 16) {
//             connectAgain()
//         }
//         console.log(countdown)
//     }, [countdown])
//     useEffect(() => {
//         setCountdown(25)
//     }, [GETPRINTSTATUS])

//     const connectAgain = () => {
//         if (recon == 'fetchData') fetchData()
//         else if (recon == 'DownloadReport') DownloadReport()

//         else setLoading(false)


//     }
//     const dieSer = (fn) => {
//         setRecon(fn)
//         setCountdown(15)
//         // clockCall = setInterval(() => {
//         //   decrementClock();
//         // }, 1000);

//     }

//     useEffect(() => {
//         if (countdown != -1) {
//             clockCall = setInterval(() => {
//                 decrementClock();
//             }, 1000);
//             return () => {
//                 clearInterval(clockCall);
//             };
//         }
//     });



//     const checkDate = (temp_date) => {
//         if (temp_date.toString().search(':') == -1) {
//             var tempdate = temp_date.split('-')
//             temp_date = new Date(tempdate[2] + '-' + tempdate[1] + '-' + tempdate[0])
//         }
//         return temp_date
//     }
//     const dateFormat = (date) => {
//         var x = new Date()
//         var year = x.getFullYear()
//         var inputyear = Number(date.substring(0, 4))
//         if (inputyear <= Number(x.getFullYear())) inputyear += 543
//         return date.substring(6, 8) + '/' + months_th_mini[Number(date.substring(4, 6)) - 1] + '/' + inputyear
//     }
//     const setnewdateF = (date) => {
//         var x = new Date(date);

//         var day = x.getDate()
//         if (day < 10)
//             day = '0' + day.toString()

//         var month = x.getMonth() + 1
//         if (month < 10)
//             month = '0' + month.toString()

//         var year = x.getFullYear()
//         return year + '' + month + '' + day
//     }
//     const regisMacAdd = async (urlser, serviceID, machineNum, userNameED, passwordED) => {
//         console.log(serviceID)
//         let tempGuid = await safe_Format._fetchGuidLog(urlser, serviceID, machineNum, userNameED, passwordED)
//         await dispatch(loginActions.guid(tempGuid))
//         fetchData()
//     };



//     const fetchData = async () => {
//         let DataGETPRINTSTATUS = []
//         dieSer('fetchData')

//         for (var i in activityReducer.RPTSVR_DATA) {

//             await fetch(databaseReducer.Data.urlser + '/RptServer', {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     'BPAPUS-BPAPSV': loginReducer.serviceID,
//                     'BPAPUS-LOGIN-GUID': loginReducer.guid,
//                     'BPAPUS-FUNCTION': 'GETPRINTSTATUS',
//                     'BPAPUS-PARAM':
//                         '{"RPTQUE_GUID": "' +
//                         activityReducer.RPTSVR_DATA[i].RPTQUE_GUID + '"}',
//                     'BPAPUS-FILTER': '',
//                     'BPAPUS-ORDERBY': '',
//                     'BPAPUS-OFFSET': '0',
//                     'BPAPUS-FETCH': '0',
//                 }),
//             })
//                 .then((response) => response.json())
//                 .then((json) => {
//                     let responseData = JSON.parse(json.ResponseData);

//                     if (responseData.RECORD_COUNT > 0) {
//                         DataGETPRINTSTATUS.push(responseData.GETPRINTSTATUS[0])
//                         setLoading(false)
//                         setCountdown(-1)
//                     } else {
//                         setCountdown(15)
//                         fetchData()
//                     }
//                 })
//                 .catch((error) => {
//                     console.log(ser_die)
//                     console.error('ERROR at fetchContent >> ' + error)
//                 })
//         }
//         setGETPRINTSTATUS(DataGETPRINTSTATUS)
//     }

//     const DownloadReport = async (tempItem) => {
//         dieSer('DownloadReport')
//         console.log(tempItem.RPTQUE_RSLT_PATH)
//         let imgbase64 = null;
//         console.log('DownloadReport tempItem.RPTQUE_RSLT_PATH=>', tempItem.RPTQUE_RSLT_PATH)
//         console.log('DownloadReport req=>', {
//             'BPAPUS-BPAPSV': loginReducer.serviceID,
//             'BPAPUS-GUID': loginReducer.guid,
//             'FilePath': '',
//             'FileName': tempItem.RPTQUE_RSLT_PATH,
//         })


//         await RNFetchBlob.config({ fileCache: true, appendExt: 'pdf' })
//             .fetch(
//                 'GET',
//                 databaseReducer.Data.urlser + '/DownloadFile',
//                 {
//                     'BPAPUS-BPAPSV': loginReducer.serviceID,
//                     'BPAPUS-GUID': loginReducer.guid,
//                     'FilePath': '',
//                     'FileName': tempItem.RPTQUE_RSLT_PATH,
//                 },
//             )
//             .then((res) => {
//                 imgbase64 = res.path();

//                 console.log('imgbase64  is', imgbase64);

//                 RNFetchBlob.android.actionViewIntent(imgbase64, 'application/pdf');
//             })
//             .catch((error) => {
//                 console.error('fetchActivityImg: ' + error);
//             });
//         // return imgbase64;

//     }

//     const _getPrinter = (PrinterItem) => {
//         setPrintItem(PrinterItem)
//         setModalVisible(true)
//         console.log(PrinterItem)
//     }




//     return (
//         <View style={container1}>
//             <StatusBar hidden={true} />

//             <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={styles.image}>
//                 {!loading_backG ? <>
//                     <View  >

//                         <KeyboardAvoidingView keyboardVerticalOffset={1}>
//                             <View style={styles.body}>
//                                 <ScrollView horizontal={true}>
//                                     <View style={styles.table}>

//                                         <View style={styles.tableHeader}>
//                                             <View style={{ flex: 0.3 }}  >
//                                                 <Text style={styles.textTitle}> รหัสรายงาน</Text></View>
//                                             <View style={{ flex: 0.4, }}  >
//                                                 <Text style={styles.textTitle}>ชื่อรายงาน</Text></View>
//                                             <View style={{ flex: 0.2 }} >
//                                                 <Text style={styles.textTitle}>ตั้งแต่</Text></View>
//                                             <View style={{ flex: 0.2 }} >
//                                                 <Text style={styles.textTitle}>ถึง</Text></View>
//                                             <View style={{ flex: 0.2 }} >
//                                                 <Text style={styles.textTitle}>สถาณะ</Text></View>
//                                             <View style={{ flex: 0.1 }} >
//                                                 <Text style={styles.textTitle}></Text></View>
//                                         </View>
//                                         <ScrollView>
//                                             {GETPRINTSTATUS.length <= 0 ? (
//                                                 <>
//                                                     <View style={styles.FaketableView}>
//                                                         <View  >
//                                                             <Text
//                                                                 style={{
//                                                                     color: Colors.fontColorSecondary,
//                                                                     fontSize: FontSize.large,
//                                                                     flex: 1
//                                                                 }}>
//                                                                 ไม่มีข้อมูล
//                                                             </Text>
//                                                         </View>

//                                                     </View>


//                                                 </>) : (<>
//                                                     {GETPRINTSTATUS.map((item) => {
//                                                         return (
//                                                             <View style={styles.tableView}>
//                                                                 <View style={{ flex: 0.3 }}  >
//                                                                     <Text style={styles.textTitleInfo}> {item.RPTSVR_CODE}</Text></View>
//                                                                 <View style={{ flex: 0.4 }}  >
//                                                                     <Text style={styles.textTitleInfo}>{`${item.RPTSVR_NAME}\n${item.RPTQUE_GUID}.pdf`}</Text></View>
//                                                                 <View style={{ flex: 0.2 }} >
//                                                                     <Text style={styles.textTitleInfo}>{dateFormat(item.RPTQUE_RQST_FROMDATE)}</Text></View>
//                                                                 <View style={{ flex: 0.2 }} >
//                                                                     <Text style={styles.textTitleInfo}>{dateFormat(item.RPTQUE_RQST_TODATE)}</Text></View>
//                                                                 <View style={{ flex: 0.2 }} >
//                                                                     <Text style={styles.textTitleInfo}>{item.SYSLKUP_T_DESC}</Text></View>
//                                                                 <View style={{ flex: 0.1 }} >
//                                                                     <TouchableOpacity
//                                                                         style={{
//                                                                             justifyContent: 'center',
//                                                                             alignItems: 'center'
//                                                                         }}
//                                                                         onPress={() => DownloadReport(item)}>

//                                                                         <FontAwesome name="download" size={FontSize.large} color={Colors.borderColor} />
//                                                                     </TouchableOpacity></View>
//                                                             </View>
//                                                         )
//                                                     })}

//                                                     <View style={styles.tableView}>
//                                                         <Text
//                                                             style={{
//                                                                 color: Colors.fontColor,
//                                                                 fontSize: FontSize.medium,
//                                                                 flex: 0.5
//                                                             }}
//                                                         >
//                                                         </Text>
//                                                     </View>
//                                                 </>)}



//                                         </ScrollView>
//                                     </View>
//                                 </ScrollView>
//                             </View>

//                         </KeyboardAvoidingView>



//                     </View>
//                 </> : <View
//                     style={{
//                         width: deviceWidth,
//                         height: deviceHeight,
//                         opacity: 0.5,
//                         backgroundColor: Colors.backgroundLoginColorSecondary,
//                         alignSelf: 'center',
//                         justifyContent: 'center',
//                         alignContent: 'center',
//                         position: 'absolute',
//                     }}>

//                 </View>}

//                 {loading && (
//                     <View
//                         style={{
//                             width: deviceWidth,
//                             height: deviceHeight,
//                             opacity: 0.5,
//                             backgroundColor: 'black',
//                             alignSelf: 'center',
//                             justifyContent: 'center',
//                             alignContent: 'center',
//                             position: 'absolute',
//                         }}>
//                         <ActivityIndicator
//                             style={{
//                                 borderRadius: 15,
//                                 backgroundColor: null,
//                                 width: 100,
//                                 height: 100,
//                                 alignSelf: 'center',
//                             }}
//                             animating={loading}
//                             size="large"
//                             color={Colors.lightPrimiryColor}
//                         />
//                     </View>
//                 )}

//             </ImageBackground>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container1: {

//         flex: 1,
//         flexDirection: 'column',
//     },
//     body: {
//         margin: 10,
//         marginBottom: 60,
//         borderRadius: 15,
//         backgroundColor: Colors.backgroundColorSecondary
//     },
//     body1e: {
//         marginTop: 20,
//         flexDirection: "row",
//         justifyContent: 'flex-end'
//     },
//     body1: {
//         marginTop: 20,
//         flexDirection: "row",
//     },
//     tabbar: {
//         height: 70,
//         padding: 5,
//         paddingLeft: 20,
//         paddingRight: 20,
//         alignItems: 'center',

//         justifyContent: 'space-between',
//         flexDirection: 'row',
//     },
//     footer: {
//         position: 'absolute',

//         justifyContent: 'center',
//         flexDirection: "row",

//         left: 0,
//         top: deviceHeight - 80,
//         width: deviceWidth,
//     },
//     table: {
//         flex: 1,
//         width: deviceWidth * 2,
//         borderRadius: 15,
//         backgroundColor: Colors.backgroundColorSecondary,
//         height: deviceHeight * 0.6,
//     },
//     tableView: {
//         paddingTop: 5,
//         paddingLeft: 10,
//         paddingRight: 10,
//         width: deviceWidth * 2,
//         flexDirection: "row",

//     },
//     FaketableView: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: deviceHeight * 0.4,
//         width: deviceWidth * 2,
//         paddingLeft: 10,
//         paddingRight: 10,

//         flexDirection: "row",

//     },
//     tableHeader: {
//         borderTopLeftRadius: 15,
//         borderTopEndRadius: 15,
//         padding: 10,
//         flexDirection: "row",
//         backgroundColor: Colors.buttonColorPrimary
//     },
//     dorpdown: {
//         justifyContent: 'center',
//         fontSize: FontSize.medium,
//     },
//     dorpdownTop: {
//         justifyContent: 'flex-end',
//         fontSize: FontSize.medium,
//     },
//     textTitle: {
//         fontSize: FontSize.medium,
//         fontWeight: 'bold',
//         color: Colors.fontColor2,
//     },
//     textTitleInfo: {
//         fontSize: FontSize.medium,
//         fontWeight: 'bold',
//         color: Colors.fontColor,
//     },
//     image: {
//         flex: 1,
//         justifyContent: "center"
//     },
//     topImage: {
//         height: deviceHeight / 3,
//         width: deviceWidth,

//     },
//     imageIcon: {
//         width: 30,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     button: {
//         marginTop: 10,
//         marginBottom: 25,
//         padding: 5,
//         alignItems: 'center',
//         backgroundColor: Colors.buttonColorPrimary,
//         borderRadius: 10,
//     },
//     textButton: {
//         fontSize: FontSize.large,
//         color: Colors.fontColor2,
//     },
//     buttonContainer: {
//         marginTop: 10,
//     },
//     checkboxContainer: {
//         flexDirection: "row",
//         marginLeft: 10,
//         marginBottom: 20,
//     },
//     checkbox: {
//         alignSelf: "center",
//         borderBottomColor: '#ffff',
//         color: '#ffff',
//     },
//     label: {
//         margin: 8,
//         color: '#ffff',
//     },
//     centeredView: {
//         flex: 1,
//         marginTop: deviceHeight * 0.3,
//         position: 'absolute',
//         justifyContent: "center",
//         alignItems: "center",
//         width: deviceWidth,
//     },
//     modalView: {
//         backgroundColor: Colors.backgroundLoginColor,
//         borderRadius: 20,
//         padding: 10,
//         width: "auto",
//         shadowColor: "#000",
//     },
//     modalText: {
//         marginBottom: 15,
//         textAlign: "center",
//         color: Colors.fontColor2,
//         fontSize: FontSize.medium
//     }
// });
// const mapStateToProps = (state) => {
//     return {


//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {

//         reduxMachineNum: (payload) => dispatch(registerActions.machine(payload)),

//     };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Report_status);
