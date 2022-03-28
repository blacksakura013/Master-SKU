import React, { useState, useEffect } from 'react';

import {
  StyleSheet, Platform, Dimensions, View, Text, Alert, TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,

} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as  ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { FontSize } from '../components/FontSizeHelper';
import { Language } from '../translations/I18n';
import * as Animatable from "react-native-animatable";
import { QRreader } from 'react-native-qr-decode-image-camera';

import { Base64 } from '../src/safe_Format';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const ScanScreen = ({ navigation, route }) => {
  let checkAndroidPermission = true
  var a = 0
  useEffect(() => {
    a = Math.floor(100000 + Math.random() * 900000);
    console.log(route.params, ' code: ', a)
  }, [])

  if (Platform.OS === 'android' && Platform.Version < 23) {
    checkAndroidPermission = false
  }
  const onSuccess = (e) => {


    if (e && e.data) {
      if (route.params?.GOODSMASTER) navigation.navigate(route.params.route, { post: e.data, data: a, GOODSMASTER: route.params.GOODSMASTER });
      else navigation.navigate(route.params.route, { post: e.data, data: a });
    }
  };

  const chooseFile = () => {
    let options = {
      title: Language.t('selectBase.SelectImg'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('response.didCancel');
      } else if (response.error) {
        console.log('response.error');
      } else {
        let path = null;
        if (Platform.OS == 'android') {
          path = response.assets[0].path;
          if (!path) {
            path = response.assets[0].uri;
          }
        } else {
          path = response.path;
          if (!path) {
            path = response.uri;
          }
        }


        QRreader(path)
          .then((data) => {
            if (data) {
              if (route.params?.GOODSMASTER) navigation.navigate(route.params.route, { post: data, data: a , GOODSMASTER: route.params.GOODSMASTER });
              else navigation.navigate(route.params.route, { post: data, data: a });
            }
          })
          .catch((error) => {
            console.log(error);
          });

      }
    });
  };


  return (
    <QRCodeScanner
      checkAndroid6Permissions={checkAndroidPermission}
      onRead={onSuccess}
      cameraType={'back'}
      fadeIn={true}
      reactivate={true}
      showMarker={true}
      customMarker={
        <View style={styles.rectangleContainer}>


          <View style={{ flexDirection: "row" }}>
            <View />

            <View style={styles.rectangle}>

              <Animatable.View
                style={styles.scanBar}
                direction="alternate-reverse"
                iterationCount="infinite"
                duration={1700}
                easing="linear"

              />
            </View>

            <View />
          </View>

          <View />
        </View>
      }
      topContent={

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 10,
            flex: 1,
          }}>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.buttonTouchable1}>
            <Icon name="angle-left" size={30} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={chooseFile}
            style={styles.buttonTouchable2}>
            <Text style={styles.buttonText}>
              {Language.t('selectBase.SelectImg')}
            </Text>
          </TouchableOpacity>
        </View>
      }
      topViewStyle={{

        alignItems: 'flex-start',
        flexDirection: 'row',
      }}

    />
  );
};

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = deviceWidth * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = deviceWidth * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "red";

const scanBarWidth = deviceWidth * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = deviceWidth * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";

const iconScanColor = "blue";

const styles = StyleSheet.create({
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  topOverlay: {
    flex: 1,
    height: deviceWidth,
    width: deviceWidth,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomOverlay: {
    flex: 1,
    height: deviceWidth,
    width: deviceWidth,
    backgroundColor: overlayColor,
    paddingBottom: deviceWidth * 0.25
  },

  leftAndRightOverlay: {
    height: deviceWidth * 0.65,
    width: deviceWidth,
    backgroundColor: overlayColor
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor
  },



  centerText: {
    flex: 1,
    fontSize: FontSize.medium,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: FontSize.medium,
    color: 'black',

  },
  buttonTouchable1: {
    alignSelf: 'flex-start',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    //padding: 16,
  },
  buttonTouchable2: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 5,

    //flex:1
    //padding: 16,
  },
});
const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);
