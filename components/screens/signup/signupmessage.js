
import * as React from 'react';
import { Text, TouchableOpacity, View, Image, StatusBar, Dimensions } from 'react-native';
import styles from './styles';

import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";
//import {Verify} from '../verify/verify'

// Theme Elements
import ThemeInput from '../../theme/form/Input'
import theme from '../../theme/style'
import SCREEN_HEADER from '../../../assets/app/header_branding_1.png'
import { Button } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpMessage(props) {
  const formMethods = useForm();
  const onSubmit = data => console.log(data);
  const getInputValue = (value) => {
    console.log(value)
  }
  return (<>
      <StatusBar backgroundColor="#126D5D" barStyle={'light-content'} />

    <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen}} >



        <View style={{ padding: 30 }}>
          <Text style={{ ...theme.f_32, ...theme.orange }}>System Message</Text>
          <Text style={{ ...theme.f_18, ...theme.gray }}>Successfully registered</Text>
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

          <TouchableOpacity onPress={() => { props.navigation.navigate('DriverRegistration') }}>
                <Text
                    style={{
                      ...theme.bg_green,
                      ...theme.w_100,
                      ...theme.px_20,
                      ...theme.py_15,
                      ...theme.white,
                      ...theme.br_5
                    }}>
                    PROCEED TO REGISTRATION
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </>
  )
}
