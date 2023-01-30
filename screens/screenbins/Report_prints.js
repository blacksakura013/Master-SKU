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
// const Report_prints = ({ route }) => {
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
//     const [GETREPORTNAME, setGETREPORTNAME] = useState([]);
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

//     const image = '../images/UI/SKU/4x/Asset22_4x.png';
//     let clockCall = null;
//     const defaultCountDown = -1;
//     const [modalVisible, setModalVisible] = useState(false);
//     const [countdown, setCountdown] = useState(defaultCountDown);
//     const [recon, setRecon] = useState('');
//     let kye_token = "";



//     useEffect(() => {
//         console.log('>> Address : ', loginReducer.ipAddress)
//         console.log('>> isSFeatures : ', loginReducer.isSFeatures, isSFeatures)
//         console.log(`>> loginReducer.endpointMother ${loginReducer.endpointMother}`)
//     }, []);

//     useEffect(() => {


//         fetchData()
//         console.log('RPTSVR_DATA', activityReducer.RPTSVR_DATA)
//     }, []);

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
//         }
//         console.log(countdown)
//     }, [countdown])
//     const connectAgain = () => {
//         if (recon == 'fetchData') fetchData()
//         else if (recon == 'PushPRINTREPORT') PushPRINTREPORT()

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
//         fetchData(tempGuid)
//     };



//     const fetchData = async (tempGuid) => {
//         dieSer('fetchData')

//         setLoading(true)


//         await fetch(databaseReducer.Data.urlser + '/RptServer', {
//             method: 'POST',
//             body: JSON.stringify({
//                 'BPAPUS-BPAPSV': loginReducer.serviceID,
//                 'BPAPUS-LOGIN-GUID': tempGuid ? tempGuid : loginReducer.guid,
//                 'BPAPUS-FUNCTION': 'GETREPORTNAME',
//                 'BPAPUS-PARAM':
//                     '{"RPTSVR_GRANT": "' +
//                     activityReducer.RPTSVR_GRANT + '"}',
//                 'BPAPUS-FILTER': '',
//                 'BPAPUS-ORDERBY': '',
//                 'BPAPUS-OFFSET': '0',
//                 'BPAPUS-FETCH': '0',
//             }),
//         })
//             .then((response) => response.json())
//             .then((json) => {
//                 let responseData = JSON.parse(json.ResponseData);

//                 if (responseData.RECORD_COUNT > 0) {
//                     console.log(responseData.GETREPORTNAME)
//                     setGETREPORTNAME(responseData.GETREPORTNAME)
//                     setLoading(false)
//                     setCountdown(-1)
//                 } else {
//                     setCountdown(15)
//                     fetchData()
//                 }


//             })
//             .catch((error) => {
//                 console.log(ser_die)
//                 console.log('ERROR at fetchContent >> ' + error)
//             })

//     }
//     const PushPRINTREPORT = async (tempGuid) => {
//         dieSer('PushPRINTREPORT')
//         setModalVisible(!modalVisible)
//         console.log(start_date)
//         console.log(end_date)
//         setLoading(true)
//         let sDate = setnewdateF(checkDate(start_date))
//         let eDate = setnewdateF(checkDate(end_date))
//         console.log(printItem.RPTSVR_GUID)
//         await fetch(databaseReducer.Data.urlser + '/RptServer', {
//             method: 'POST',
//             body: JSON.stringify({
//                 'BPAPUS-BPAPSV': loginReducer.serviceID,
//                 'BPAPUS-LOGIN-GUID': tempGuid ? tempGuid : loginReducer.guid,
//                 'BPAPUS-FUNCTION': 'PRINTREPORT',
//                 'BPAPUS-PARAM':
//                     '{"RPTSVR_GRANT": "' +
//                     activityReducer.RPTSVR_GRANT +
//                     '","RPTSVR_GUID": "' +
//                     printItem.RPTSVR_GUID +
//                     '","RPTQUE_RQST_FROMDATE": "' +
//                     sDate +
//                     '","RPTQUE_RQST_TODATE": "' +
//                     eDate +
//                     '","RPTQUE_RQST_OPTN": "","RPTQUE_RQST_PARAM": ""}',
//                 'BPAPUS-FILTER': '',
//                 'BPAPUS-ORDERBY': '',
//                 'BPAPUS-OFFSET': '0',
//                 'BPAPUS-FETCH': '0',
//             }),
//         })
//             .then((response) => response.json())
//             .then((json) => {
//                 let responseData = JSON.parse(json.ResponseData);
//                 let tempRPTSVR_DATA = activityReducer.RPTSVR_DATA
//                 if (json.ResponseCode == 200) {
//                     console.log(responseData)
//                     setPrintItem({})
//                     tempRPTSVR_DATA.push(responseData)
//                     dispatch(activityActions.RPTSVR_DATA(tempRPTSVR_DATA))
//                     Alert.alert(Language.t('notiAlert.header'), `สร้างเอกสารสำเร็จ คุณต้องการตรวจสอบสถาณะหรือไม่?`, [{
//                         text: Language.t('selectBase.yes'), onPress: () => navigation.navigate('Report_status', {})
//                     }, { text: Language.t('selectBase.no'), onPress: () => console.log('cancel') }]);
//                 } else {
//                     Alert.alert(Language.t('notiAlert.header'), `สร้างเอกสารไม่สำเร็จ ${json.ReasonString}`, [{
//                         text: Language.t('selectBase.yes'), onPress: () => console.log('')
//                     }]);
//                 }
//                 console.log(json)
//                 setLoading(false)
//                 setCountdown(-1)
//             })
//             .catch((error) => {
//                 console.log(ser_die)
//                 setCountdown(-1)
//                 console.log('ERROR at fetchContent >> ' + error)
//             })
//         setCountdown(-1)
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
//                     <View style={{ height: deviceHeight / 2.2 }}>
//                         <ScrollView   >
//                             <KeyboardAvoidingView keyboardVerticalOffset={1}>
//                                 <View style={styles.body}>
//                                     <ScrollView horizontal={true}>
//                                         <View style={styles.table}>
//                                             <View style={styles.tableHeader}>
//                                                 <View style={{ flex: 0.3 }}  >
//                                                     <Text style={styles.textTitle}> รหัสรายงาน</Text></View>
//                                                 <View style={{ flex: 0.4, }}  >
//                                                     <Text style={styles.textTitle}>ชื่อรายงาน</Text></View>
//                                                 <View style={{ flex: 0.2 }} >
//                                                     <Text style={styles.textTitle}>รูปแบบ</Text></View>
//                                                 <View style={{ flex: 0.2 }} >
//                                                     <Text style={styles.textTitle}>รูปแบบ</Text></View>
//                                                 <View style={{ flex: 0.1 }} >
//                                                     <Text style={styles.textTitle}>รูปแบบ</Text></View>
//                                                 <View style={{ flex: 0.1 }} >
//                                                     <Text style={styles.textTitle}></Text></View>
//                                             </View>
//                                             <ScrollView>
//                                                 {GETREPORTNAME.length <= 0 ? (
//                                                     <>
//                                                         <View style={styles.FaketableView}>
//                                                             <View  >
//                                                                 <Text
//                                                                     style={{
//                                                                         color: Colors.fontColorSecondary,
//                                                                         fontSize: FontSize.large,
//                                                                         flex: 1
//                                                                     }}>
//                                                                     ไม่มีข้อมูล
//                                                                 </Text>
//                                                             </View>
//                                                         </View>
//                                                     </>) : (<>
//                                                         {GETREPORTNAME.map((item) => {
//                                                             return (
//                                                                 <View style={styles.tableView}>
//                                                                     <View style={{ flex: 0.3 }}  >
//                                                                         <Text style={styles.textTitleInfo}> {item.RPTSVR_CODE}</Text></View>
//                                                                     <View style={{ flex: 0.4 }}  >
//                                                                         <Text style={styles.textTitleInfo}>{item.RPTSVR_NAME}</Text></View>
//                                                                     <View style={{ flex: 0.2 }} >
//                                                                         <Text style={styles.textTitleInfo}>{item.RPTSVR_RPF_DD_PROMPT}</Text></View>
//                                                                     <View style={{ flex: 0.2 }} >
//                                                                         <Text style={styles.textTitleInfo}>{item.RPTSVR_RPF_DD_FIELD}</Text></View>
//                                                                     <View style={{ flex: 0.1 }} >
//                                                                         <Text style={styles.textTitleInfo}>{item.RPTSVR_RPF_DD_PROP}</Text></View>
//                                                                     <View style={{ flex: 0.1 }} >
//                                                                         <TouchableOpacity
//                                                                             style={{
//                                                                                 justifyContent: 'center',
//                                                                                 alignItems: 'center'
//                                                                             }}
//                                                                             onPress={() => {
//                                                                                 Alert.alert(Language.t('notiAlert.header'), `คุณต้องการสั่งพิมพ์เอกสาร ${item.RPTSVR_NAME} ใช่ หรือไม่?`, [{
//                                                                                     text: Language.t('selectBase.yes'), onPress: () => _getPrinter(item)
//                                                                                 }, { text: Language.t('selectBase.no'), onPress: () => console.log('cancel') }]);
//                                                                             }} >
//                                                                             <FontAwesome name="print" size={FontSize.large} color={Colors.borderColor} />
//                                                                         </TouchableOpacity></View>
//                                                                 </View>
//                                                             )
//                                                         })}

//                                                         <View style={styles.tableView}>
//                                                             <Text
//                                                                 style={{
//                                                                     color: Colors.fontColor,
//                                                                     fontSize: FontSize.medium,
//                                                                     flex: 0.5
//                                                                 }}
//                                                             >
//                                                             </Text>
//                                                         </View>
//                                                     </>)}
//                                             </ScrollView>
//                                         </View>
//                                     </ScrollView>
//                                 </View>

//                             </KeyboardAvoidingView>


//                         </ScrollView>
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
//                 <View style={styles.centeredView}>
//                     <Modal
//                         animationType="slide"
//                         transparent={true}
//                         visible={modalVisible}
//                         onRequestClose={() => {
//                             setModalVisible(!modalVisible);
//                         }}>
//                         < TouchableOpacity
//                             onPress={() => setModalVisible(!modalVisible)}
//                             style={styles.centeredView}>
//                             <View>
//                                 <View style={styles.modalView}>
//                                     <View style={{
//                                         justifyContent: 'space-between',
//                                         flexDirection: 'row'
//                                     }}>
//                                         <View width={20}></View>
//                                         <Text style={styles.modalText}>เลือกการค้นหา</Text>
//                                         <Pressable style={{ alignItems: 'flex-end' }} onPress={() => setModalVisible(!modalVisible)}>
//                                             <FontAwesome name="close" color={Colors.backgroundColor} size={FontSize.large} />
//                                         </Pressable>
//                                     </View>
//                                     <View style={{ backgroundColor: Colors.fontColor2, borderRadius: 20, padding: 10 }}>

//                                         <View style={{
//                                             flexDirection: 'row', justifyContent: 'space-between',
//                                             alignItems: 'center', marginBottom: 10,
//                                         }}>
//                                             <Text style={{ fontSize: FontSize.medium, marginRight: 5, color: 'black', fontWeight: 'bold', }}>ตั้งแต่</Text>
//                                             <DatePicker
                                               
//                                                 style={{ width: 250, }}
//                                                 date={start_date} //start date
//                                                 mode="date"
//                                                 placeholder="select date"
//                                                 format="DD-MM-YYYY"
//                                                 confirmBtnText="Confirm"
//                                                 cancelBtnText="Cancel"
//                                                 customStyles={{
//                                                     dateIcon: {
//                                                         left: 0,
//                                                         top: 4,
//                                                         marginLeft: 0,

//                                                     },
//                                                     dateInput: {
//                                                     }

//                                                     // ... You can check the source to find the other keys.
//                                                 }}
//                                                 onDateChange={(date) => {
//                                                     setS_date(date)

//                                                 }}
//                                             />
//                                         </View>
//                                         <View style={{
//                                             flexDirection: 'row', justifyContent: 'space-between',
//                                             alignItems: 'center', marginBottom: 10
//                                         }}>
//                                             <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>ถึง</Text>
//                                             <DatePicker
//                                                 style={{ width: 250, }}
//                                                 date={end_date} //start date
//                                                 mode="date"
//                                                 placeholder="select date"
//                                                 format="DD-MM-YYYY"
//                                                 confirmBtnText="Confirm"
//                                                 cancelBtnText="Cancel"
//                                                 customStyles={{
//                                                     dateIcon: {
//                                                         left: 0,
//                                                         top: 4,
//                                                         marginLeft: 0
//                                                     },
//                                                     dateInput: {
//                                                     }
//                                                     // ... You can check the source to find the other keys.
//                                                 }}
//                                                 onDateChange={(date) => {
//                                                     setE_date(date)

//                                                 }}
//                                             />
//                                         </View>
//                                         <Pressable
//                                             style={[styles.button, styles.buttonClose]}
//                                             onPress={() => PushPRINTREPORT()}>
//                                             <Text style={styles.textTitle}>ตกลง</Text>
//                                         </Pressable>
//                                     </View>
//                                 </View>
//                             </View>
//                         </TouchableOpacity>
//                     </Modal>
//                 </View>
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
//         backgroundColor: Colors.backgroundColorSecondary
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
//         backgroundColor: Colors.buttonColorPrimary,

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
// export default connect(mapStateToProps, mapDispatchToProps)(Report_prints);
