import React, { useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, SafeAreaView } from 'react-native';
import BACKGROUND from '../../../assets/app/splash_screen.png';
import LOGO from '../../../assets/app/logo_1.png';
import splash_cat from '../../../assets/app/splash.png';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import NavigationBar from 'react-native-navbar-color'
import ScreenLoader from '../component/ScreenLoader';
const SplashScreen = (props) => {

    const [loaded] = useFonts({
        Barlow_ExtraBold: require('../../../assets/fonts/barlow/Barlow-ExtraBold.ttf'),
        FredokaOne: require('../../../assets/fonts/FredokaOne/FredokaOne-Regular.ttf'),
    });


    if (loaded) {
        return (

            <View  >
                <StatusBar translucent backgroundColor="transparent" />
                <LinearGradient style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }} id='Main-page' colors={['#CB587F', '#F6756B']} >
                    <Text style={{ fontSize: 100, color: 'white', fontFamily: 'FredokaOne' }}>Piklo</Text>
                    <Image style={{ width: 180, height: 180, resizeMode: 'contain', position: 'absolute', bottom: 50, left: 10 }} source={splash_cat}></Image>
                </LinearGradient>
            </View >
        )
    }
    else {
        return null
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    logo: {
        position: 'absolute',
        bottom: 20,
        right: 20
    }

});
export default SplashScreen