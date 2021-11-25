
import * as React from 'react';
import {Text, TouchableOpacity, View,Dimensions, ActivityIndicator} from 'react-native';

import { useForm, Controller,FormProvider } from "react-hook-form";
import firebase from '../../firebase';

// Theme Elements
import OTPFiller from '../../theme/form/OTPFiller'
import theme from '../../theme/style'

import ThemeButton from '../../theme/buttons';
import { Icon, Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function VerifyMobile (props){
  const { data } = props.route.params;
  const [visible, setVisible] = React.useState(false);
  const formMethods = useForm();
  const onSubmit = async (code) => {
    setVisible(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        data.verificationId,
        code
      );
      await firebase.auth().signInWithCredential(credential);
      props.setLogin(true)
    } catch (err) {
      setVisible(false);
      Toast.show("Verification code is wrong.")
      console.log(err)
    }
};

  return(
    <>
      <View id='Main-page' colors={['#ffffff', '#ffffff']} style={theme.main_screen} >

          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack()
            }}
            style={{
              ...theme.py_10,
              justifyContent: 'flex-start',
              alignSelf: 'flex-start'
            }}
          >
            <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
          </TouchableOpacity>
          {/* Sign In */}
          <View style={{padding:30}}>
            <Text style={{
              ...theme.f_32,
              ...theme.theme_heading_color,
              fontWeight: 'bold',
              marginTop: 30,
            }}>Verify Mobile</Text>
            <Text style={{ ...theme.f_18, ...theme.gray}}>Enter OTP code sent by SMS</Text>
            <FormProvider {...formMethods}>
              <OTPFiller
                callback={(v)=>{
                  if(v.length == 6){
                    onSubmit(v)
                  }
                }}
                inputLength={6}
                containerStyle={{...theme.mt_30}}
              inputStyle={{ borderColor: '#D6D6D6', borderBottomWidth: 4, width: 40, fontSize: 30, textAlign: 'center', paddingVertical: 7, color:'#CB587F'}}/>
            </FormProvider>
            <ThemeButton style={{ marginTop: 20, }} text="LOGIN" onPressAction={formMethods.handleSubmit(onSubmit)} />
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
        <Overlay isVisible={visible} >
          <ActivityIndicator size="large" color={theme.purple.color} />
          <Text>Verifying...</Text>
        </Overlay>
        </View>

    </>
    )
  }

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    setLogin: (data) => dispatch({ type: 'SET_LOGIN', payload: data }),

  }
}
const mapStateToProps = (state) => {
  const { user } = state
  return { user: user }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyMobile)