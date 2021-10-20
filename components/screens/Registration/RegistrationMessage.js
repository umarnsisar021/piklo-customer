
import * as React from 'react';
import { Text, TouchableOpacity, View, Image, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";

//import {Verify} from '../verify/verify'

// Theme Elements
import theme from '../../theme/style'
import ThemeButton from '../../theme/buttons'
import SCREEN_HEADER from '../../../assets/app/header_branding_1.png'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RegistrationMessage(props) {
  const formMethods = useForm();
  const onSubmit = data => console.log(data);
  const getInputValue = (value) => {
    console.log(value)
  }
  return (<>


    <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen}} >
        <View style={{ padding: 30, ...theme.mt_40 }}>
        <Text style={{ ...theme.f_30, ...theme.black,...theme.heading_font}}>Application Submitted</Text>
        <Text style={{ ...theme.f_16, ...theme.gray }}>Your account is being verified, and
        we will get back to you if we require
additional information.</Text>
        </View>

        <View
          style={{
            ...theme.w_100,
            ...theme.absolute,
            ...theme.p_30,
            ...theme.align_center,
          top: windowHeight - 120
          }}>
          <View style={{
            ...theme.row,
            ...theme.align_center,
          }}>


          <ThemeButton style={{ width: '45%' }} text="Login" onPressAction={() => { props.navigation.navigate('Login') }} />

          </View>
        </View>
      </LinearGradient>

    </>
  )
}
