
import * as React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Image,KeyboardAvoidingView , TextInput,ImageBackground , StatusBar,TouchableWithoutFeedback ,Keyboard,Dimensions} from 'react-native';
import styles from './styles';
import logo from '../../../assets/app/logo_1.png';
import ElevatedView from 'react-native-elevated-view';
import { Icon } from 'react-native-elements';
import { useForm, Controller,FormProvider } from "react-hook-form";
//import {Verify} from '../verify/verify'

// Theme Elements
import ThemeInput from '../../theme/form/Input'
import ThemeCheckBox from '../../theme/form/CheckBox'
import OTPFiller from '../../theme/form/OTPFiller'
import theme from '../../theme/style'

import SCREEN_HEADER from '../../../assets/app/header_branding_1.png'
import nine_box from '../../../assets/icons/9box.png'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default  function VerifyMobile (props){

  const formMethods = useForm();
  const [passwordView, setPassworView] = React.useState(true);
  const onSubmit = data => console.log(data);

  const getInputValue =(value) =>{
    console.log(value)
  }
  return(
    <>
    <StatusBar backgroundColor="#126D5D" barStyle={'light-content'} />

      <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen}} >


          {/* Sign In */}
          <View style={{padding:30}}>
          <Text style={{...theme.f_32,...theme.orange}}>Verify Mobile</Text>
          <Text style={{...theme.f_18,...theme.gray}}>Enter OTP code sent by SMS</Text>
            <FormProvider {...formMethods}>
              <OTPFiller
                callback={(v)=>{console.log(v)}}
                inputLength={4}
              containerStyle={{...theme.mt_30}}
                inputStyle={{borderColor:'#D6D6D6',borderBottomWidth:4,width:40,fontSize:30,textAlign:'center',paddingVertical:7,color:'#126D5D'}}/>
            </FormProvider>
            <TouchableOpacity onPress={()=>{props.navigation.navigate('SignUp')}}
              style={{
                ...theme.w_100,
                ...theme.p_15,
                ...theme.mt_20,
                ...theme.align_center,
                ...theme.w_100,
                ...theme.bg_green,
                borderRadius:5}}
              >
                  <Text style={{color:'white'}}>SEND</Text>
            </TouchableOpacity>
          </View>
          <View style={{width:'100%',padding:30,alignItems:'center',}}>
                <View>
            <Text style={{ color: '#707070', fontSize: 16, alignSelf: 'center', textAlign: 'center' }}>Check your SMS. We have sent you the PIN at <Text style={{ ...theme.orange }}>+92 321 2010932</Text></Text>
                </View>
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
            ...theme.align_center
          }}>
            <Text style={{
              ...theme.row,
              ...theme.gray,
              ...theme.f_16,
              alignSelf: 'center',
            }}>Back to </Text>
                  <TouchableOpacity onPress={()=>{props.navigation.navigate('Login')}}>
                    <Text style={{
                      ...theme.orange,
                      ...theme.f_16
                    }}>Sign In</Text>
                  </TouchableOpacity>
                </View>
          </View>
        </View>

    </>
    )
  }
