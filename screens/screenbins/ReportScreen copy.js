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
import Colors from '../../src/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FontSize } from '../../components/FontSizeHelper';
import { useNavigation } from '@react-navigation/native';

// import { View } from 'react-native-paper';

import Dialog from 'react-native-dialog';
import { Language, changeLanguage } from '../../translations/I18n';
import DeviceInfo from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var ser_die = true
import * as loginActions from '../../src/actions/loginActions';
import * as registerActions from '../../src/actions/registerActions';
import * as databaseActions from '../../src/actions/databaseActions';
import * as safe_Format from '../../src/safe_Format';
import { fontWeight, style } from 'styled-system';
import SearchableDropdown from 'react-native-searchable-dropdown';
const ReportScreen = ({ route }) => {
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
    const [loading, setLoading] = useStateIfMounted(false);
    const [loading_backG, setLoading_backG] = useStateIfMounted(true);
    const image = '../images/UI/Menu/BG+mas.png';
    useEffect(() => {

        console.log()
        console.log()
        console.log('index >> ', navigation.getState().index)

        const backAction = () => {
            if (navigation.getState().index == 0) {


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
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);




    const logOut = async () => {
        setLoading(true)

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

            }
            )
            .catch((error) => {
                console.error('ERROR at _fetchGuidLogin' + error);
            });
    };

    return (
        <View style={container1}>
            <StatusBar hidden={true} />
            <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(false) }} resizeMode="cover" style={styles.image}>
                {!loading_backG ? <>
                    <View style={{ marginTop: 150 }}>
                        <View style={tabbar} >
                            <View style={{
                                backgroundColor: '#fff', alignSelf: 'center',
                                justifyContent: 'center', borderRadius: 20, flexDirection: 'row', marginBottom: 10
                            }}>
                            </View>
                        </View>
                    </View>


                    <View style={{ marginTop: deviceHeight * 0.1 }}>
                        <SafeAreaView >
                            <KeyboardAvoidingView >
                                <View style={styles.body} >
                                    <View style={{ padding: 5 }}>
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Report_prints', {})}>
                                            <Text style={styles.textButton}>
                                                สั่งพิมพ์รายงาน
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Report_status', {})}>
                                            <Text style={styles.textButton}>
                                                ตรวจสอบผลการพิมพ์
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View style={{ padding: 5 }}>
                                        <TouchableOpacity style={styles.button}>
                                            <Text style={styles.textButton}>
                                                เอกสารที่ดาวน์โหลด
                                            </Text>
                                        </TouchableOpacity>
                                    </View> */}
                                    <View style={{ padding: 5 }}>
                                        <TouchableOpacity
                                            style={{
                                                height: deviceHeight * 0.1,
                                                width: deviceHeight * 0.1,
                                                borderRadius: deviceHeight * 0.1,
                                                backgroundColor: 'red',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            onPress={() => { navigation.goBack() }} >
                                            <FontAwesome name="arrow-left" size={30} color={Colors.backgroundLoginColorSecondary} />
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </KeyboardAvoidingView>

                        </SafeAreaView>
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

        borderRadius: 15,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',

    },
    body1e: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: 'flex-end'

    },
    body1: {
        marginTop: 20,

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
        height: deviceHeight * 0.1, width: deviceWidth * 0.9,
        backgroundColor: Colors.borderColor,
        shadowColor: Colors.backgroundLoginColorSecondary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1.0,
        borderRadius: deviceHeight * 0.03,
        justifyContent: 'center',
        alignItems: 'center',
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
export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);
