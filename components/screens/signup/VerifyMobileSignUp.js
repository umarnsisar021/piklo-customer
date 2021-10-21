
import * as React from 'react';
import {Text, TouchableOpacity, View,Dimensions, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import { useForm,FormProvider } from "react-hook-form";


// Theme Elements
import OTPFiller from '../../theme/form/OTPFiller'
import theme from '../../theme/style'
import useJwt from '../../util/util'
import firebase from '../../firebase';
import ThemeButton from '../../theme/buttons';
const windowHeight = Dimensions.get('window').height;

function VerifyMobileSignUp (props){
  const { data } = props.route.params;
  const [visible, setVisible] = React.useState(false);
  const formMethods = useForm();
  React.useEffect(()=>{
    setVisible(false);
  },[])
  const onSubmit = async (code) => {
    setVisible(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        data.verificationId,
        code
      );
      await firebase.auth().signInWithCredential(credential);
      delete data.formData.agree
      delete data.formData.country_code
      console.log({ ...data.formData})
      useJwt.post('customers/Authentication/signup', {
        ...data.formData
      }).then((res) => {
        setVisible(false);
        let loginData= {
          username: data.formData.username,
          password: data.formData.password,
          device_id: data.formData.device_id,
        }
        useJwt.post("customers/Authentication/login", { ...loginData}).then((res)=>{
          console.log('loged')
          props.setUserData(res.data.data.user_detail)
          props.setToken(res.data.data.token)
          props.setLogin(true)
        }).catch((error) => {
          console.log(error.response)
        })
      }).catch((error)=>{
         setVisible(false);
         console.log(error.response.data.message)
      })
    } catch (err) {
      console.log(err)
      setVisible(false);
    }
};



  return(
    <>
      <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={theme.main_screen} >

          {/* Sign In */}
          <View style={{padding:30}}>
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
            <Text style={{
              ...theme.f_32,
              ...theme.theme_heading_color,
              fontWeight: 'bold',
              marginTop: 0,
            }}>Verify Mobile</Text>
            <Text style={{ ...theme.f_16, ...theme.gray}}>Enter OTP code sent by SMS</Text>
            <FormProvider {...formMethods}>
              <OTPFiller
                callback={(v)=>{
                  if(v.length == 6){
                    onSubmit(v)
                  }
                }}
                inputLength={6}
                containerStyle={{marginTop:'50%'}}
              inputStyle={{ borderColor: '#D6D6D6', borderBottomWidth: 4, width: 40, fontSize: 30, textAlign: 'center', paddingVertical: 7, color:'#CB587F'}}/>
            </FormProvider>
            <ThemeButton style={{ marginTop: 20, }} text="VERIFY" onPressAction={formMethods.handleSubmit(onSubmit)} />
          </View>
          <View style={{width:'100%',padding:30,alignItems:'center',}}>
                <View>
            <Text style={{ color: '#707070', fontSize: 16, alignSelf: 'center', textAlign: 'center' }}>Check your SMS. We have sent you the PIN at <Text style={{ ...theme.orange }}>+{data.formData.mobile_no}</Text></Text>
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
          <ActivityIndicator size="large" color="#FFA253" />
          <Text>Verifying...</Text>
        </Overlay>
        </LinearGradient>

    </>
    )
  }

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    setLogin: (data) => dispatch({ type: 'SET_LOGIN', payload: data }),
    setUserData: (data) => dispatch({ type: 'SET_USER_DETAILS', payload: data }),
    setUserProfile: (data) => dispatch({ type: 'SET_USER_PROFILE', payload: data }),
    setUserId: (data) => dispatch({ type: 'SET_USER_ID', payload: data }),
    setToken: (data) => dispatch({ type: 'SET_TOKEN', payload: data }),
    loginCredentials: (data) => dispatch({ type: 'SET_LOGIN_CREDENTIALS', payload: data }),

  }
}
const mapStateToProps = (state) => {
  const { user } = state
  return { user: user }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyMobileSignUp)