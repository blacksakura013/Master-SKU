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
// import Modal from 'react-native-modal';
import { Picker, } from 'native-base';

import { SafeAreaView } from 'react-native-safe-area-context';


import { useStateIfMounted } from 'use-state-if-mounted';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


import { FontSize } from '../../components/FontSizeHelper';



import Colors from '../../src/Colors';
import { fontSize, fontWeight } from 'styled-system';
import * as Calendars from './Calendar_Format';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const CalendarScreen = ({ route }) => {


    const navigation = useNavigation();


    var daily = new Date()
    const [loading_backG, setLoading_backG] = useStateIfMounted(false);
    const [dateIndex, set_DateIndex] = useState(daily.getDate())
    const [monthIndex, set_MonthIndex] = useState(daily.getMonth())
    const [yearIndex, set_yearIndex] = useState(daily.getFullYear() + 453)
    useEffect(() => {
        let Arrdata = []

        if (route.params?.key && route.params.key == 'start_date')
            Arrdata = route.params.data.start_date.split('-')
        else
            Arrdata = route.params.data.end_date.split('-')
        console.log(Arrdata)
        set_DateIndex(Arrdata.length > 0 ? parseInt(Arrdata[0]) : daily.getDate())
        set_MonthIndex(Arrdata.length > 0 ? parseInt(Arrdata[1]) - 1 : daily.getMonth())
        set_yearIndex(Arrdata.length > 0 ? parseInt(Arrdata[2]) : daily.getFullYear())
        console.log(route.params.key)
        console.log(route.params.data.start_date)
        setLoading_backG(true)
        //backsakura013
    }, [route.params?.key]);






    const image = '../../images/UI/endpoint/4x/Asset12_4x.png'


    const setMonthState = (itemValue, itemIndex) => {
        set_MonthIndex(itemIndex)
    }
    useEffect(() => {
        console.log(fulldate())

    }, [dateIndex])
    useEffect(() => {
        console.log(fulldate())

    }, [monthIndex])
    useEffect(() => {
        console.log(fulldate())

    }, [yearIndex])
    const fulldate = () => {
        let d = dateIndex
        let m = monthIndex + 1
        let y = yearIndex
        return `${d.toString().length > 1 ? d : '0' + d}-${m.toString().length > 1 ? m : '0' + m}-${y}`
    }
    return (

        <ImageBackground source={require(image)} onLoadEnd={() => { setLoading_backG(true) }} resizeMode="cover" style={styles.image}>
            {loading_backG ? (


                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                            <View width={deviceWidth * 0.2} padding={10} >
                                <Text style={styles.textTitleInfo}>
                                    ปี :
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderColor: Colors.borderColor, backgroundColor: Colors.backgroundColorSecondary, borderWidth: 1, padding: 10, borderRadius: 10
                                }}>
                                <Text style={{ fontSize: FontSize.large }}></Text>
                                <Picker
                                    selectedValue={yearIndex}
                                    enabled={true}
                                    mode="dropdown"
                                    style={{ color: Colors.itemColor, width: deviceWidth - deviceWidth * 0.3, backgroundColor: Colors.backgroundColorSecondary }}
                                    onValueChange={(itemValue, itemIndex) => set_yearIndex(itemValue, itemIndex)}>
                                    {Calendars.state_years.map((obj, index) => {
                                        return (
                                            <Picker.Item color={Colors.itemColor} style={{ backgroundColor: Colors.backgroundColorSecondary }} label={obj.toString()} value={obj} />
                                        )
                                    })}
                                </Picker>
                            </View>


                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <View width={deviceWidth * 0.2} padding={10}>
                                <Text style={styles.textTitleInfo}>
                                    เดือน :
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginTop: 10, flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderColor: Colors.borderColor, backgroundColor: Colors.backgroundColorSecondary, borderWidth: 1, padding: 10, borderRadius: 10

                                }}>
                                <Text style={{ fontSize: FontSize.large }}></Text>
                                <Picker
                                    selectedValue={monthIndex}
                                    enabled={true}
                                    mode="dropdown"
                                    style={{ color: Colors.itemColor, width: deviceWidth - deviceWidth * 0.3, backgroundColor: Colors.backgroundColorSecondary }}
                                    onValueChange={(itemValue, itemIndex) => set_MonthIndex(itemValue, itemIndex)}>
                                    {Calendars.months_th.map((obj, index) => {
                                        return (
                                            <Picker.Item color={Colors.itemColor} style={{ backgroundColor: Colors.backgroundColorSecondary }} label={obj} value={index} />
                                        )
                                    })}
                                </Picker>
                            </View>

                        </View>
                        <View width={deviceWidth * 0.2} padding={10}>
                            <Text style={styles.textTitleInfo}>
                                วัน :
                            </Text>
                        </View>
                        <View>
                            <View
                                style={{
                                    backgroundColor: Colors.backgroundLoginColorSecondary,
                                    flexDirection: 'column',
                                    margin: 10,
                                    borderRadius: 10,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    paddingTop: 10,
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
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{
                                        width: 30, height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15, backgroundColor: null
                                    }}>
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>{'อา'}</Text>
                                    </View>
                                    <View style={{
                                        width: 30, height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15, backgroundColor: null
                                    }}>
                                        <Text style={{ color: Colors.fontColor, fontWeight: 'bold' }}>{'จ'}</Text>
                                    </View>
                                    <View style={{
                                        width: 30, height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15, backgroundColor: null
                                    }}>
                                        <Text style={{ color: Colors.fontColor, fontWeight: 'bold' }}>{'อ'}</Text>
                                    </View>
                                    <View style={{
                                        width: 30, height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15, backgroundColor: null
                                    }}>
                                        <Text style={{ color: Colors.fontColor, fontWeight: 'bold' }}>{'พ'}</Text>
                                    </View>
                                    <View style={{
                                        width: 30, height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15, backgroundColor: null
                                    }}>
                                        <Text style={{ color: Colors.fontColor, fontWeight: 'bold' }}>{'พฤ'}</Text>
                                    </View>
                                    <View style={{
                                        width: 30, height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15, backgroundColor: null
                                    }}>
                                        <Text style={{ color: Colors.fontColor, fontWeight: 'bold' }}>{'ศ'}</Text>
                                    </View>
                                    <View style={{
                                        width: 30, height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15, backgroundColor: null
                                    }}>
                                        <Text style={{ color: Colors.fontColor, fontWeight: 'bold' }}>{'ส'}</Text>
                                    </View>
                                </View>
                                {Calendars.Day_Calendar(yearIndex, monthIndex).map((item, index) => {
                                    return (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <TouchableOpacity
                                                style={{
                                                    width: 30, height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 15, backgroundColor: item[0] == dateIndex ? Colors.itemColor : null
                                                }}
                                                onPress={() => set_DateIndex(item[0])}
                                            >
                                                <Text style={{ color: item[0] == dateIndex ? Colors.backgroundColor : 'red' }}>
                                                    {item[0]}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    width: 30, height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 15, backgroundColor: item[1] == dateIndex ? Colors.itemColor : null
                                                }}
                                                onPress={() => set_DateIndex(item[1])}
                                            >
                                                <Text style={{ color: item[1] == dateIndex ? Colors.backgroundColor : 'black' }}>
                                                    {item[1]}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    width: 30, height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 15, backgroundColor: item[2] == dateIndex ? Colors.itemColor : null
                                                }}
                                                onPress={() => set_DateIndex(item[2])}
                                            >
                                                <Text style={{ color: item[2] == dateIndex ? Colors.backgroundColor : 'black' }}>
                                                    {item[2]}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    width: 30, height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 15, backgroundColor: item[3] == dateIndex ? Colors.itemColor : null
                                                }}
                                                onPress={() => set_DateIndex(item[3])}
                                            >
                                                <Text style={{ color: item[3] == dateIndex ? Colors.backgroundColor : 'black' }}>
                                                    {item[3]}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    width: 30, height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 15, backgroundColor: item[4] == dateIndex ? Colors.itemColor : null
                                                }}
                                                onPress={() => set_DateIndex(item[4])}
                                            >
                                                <Text style={{ color: item[4] == dateIndex ? Colors.backgroundColor : 'black' }}>
                                                    {item[4]}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    width: 30, height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 15, backgroundColor: item[5] == dateIndex ? Colors.itemColor : null
                                                }}
                                                onPress={() => set_DateIndex(item[5])}
                                            >
                                                <Text style={{ color: item[5] == dateIndex ? Colors.backgroundColor : 'black' }}>
                                                    {item[5]}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    width: 30, height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 15, backgroundColor: item[6] == dateIndex ? Colors.itemColor : null
                                                }}
                                                onPress={() => set_DateIndex(item[6])}>
                                                <Text style={{ color: item[6] == dateIndex ? Colors.backgroundColor : 'black' }}>
                                                    {item[6]}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, }}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ReportScreen', {
                                        key: route.params.key, data: {
                                            start_date:
                                                route.params.key == 'start_date' ?
                                                    fulldate() :
                                                    route.params.data.start_date,
                                            end_date:
                                                route.params.key == 'end_date' ?
                                                    fulldate() :
                                                    route.params.data.end_date
                                        }
                                    })}
                                    style={{
                                        flexDirection: 'row', justifyContent: 'center',
                                        borderColor: Colors.itemColor, backgroundColor: Colors.buttonColorPrimary,
                                        padding: 10, borderRadius: 10,
                                        width: deviceWidth / 2.5, margin: 10
                                    }}>
                                    <Text style={{ fontSize: FontSize.large, color: Colors.fontColor2 }}>ตกลง</Text>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={{
                                        flexDirection: 'row', justifyContent: 'center',
                                        borderColor: Colors.itemColor, backgroundColor: Colors.itemColor,
                                        padding: 10, borderRadius: 10,
                                        width: deviceWidth / 2.5, margin: 10
                                    }}>
                                    <Text style={{ fontSize: FontSize.large, color: Colors.fontColor2 }}>ยกเลิก</Text>

                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>

            ) : (
                <View
                    style={{
                        width: deviceWidth,
                        height: deviceHeight,
                        opacity: 0.03,
                        backgroundColor: Colors.itemColor,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        position: 'absolute',
                    }}>

                </View>
            )}
        </ImageBackground>




    );
};

const styles = StyleSheet.create({
    container1: {



    },
    image: {
        flex: 1,

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
        height: deviceHeight / 3.6,
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
    centeredView: {
        flex: 1,
        marginTop: 50,
        padding: 10,
        alignItems: "center",


    },
    modalView: {


        padding: 10,
        width: "auto",
        shadowColor: "#000",
    },
    textTitle: {
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: Colors.fontColor2,
    },
    textTitleInfo: {
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: Colors.fontColor,
    },
});


export default CalendarScreen;
