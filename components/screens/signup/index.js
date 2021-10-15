
import * as React from 'react';
import {ScrollView, ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Image,KeyboardAvoidingView , TextInput,ImageBackground , StatusBar,TouchableWithoutFeedback ,Keyboard,Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon,Overlay } from 'react-native-elements';
import { useForm, Controller,FormProvider } from "react-hook-form";
import ThemeInput from '../../theme/form/Input'
import ThemeCheckBox from '../../theme/form/CheckBox'
import ThemeButton from '../../theme/buttons'
import theme from '../../theme/style.js'
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import { validate } from '../../util/fn'
import useJwt from '../../util/util';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SignUp  (props){


  const formMethods = useForm();
  let formErrors = formMethods.formState.errors;
  const [visible, setVisible] = React.useState(false);
  const [validatingMessageText, setValidatingMessageText] = React.useState('');
  const [passwordView, setPassworView] = React.useState(true);
  let inputRef = React.useRef();
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  inputRef.current = {};
  inputRef.current['mobile_no'] = React.createRef();
  inputRef.current['email'] = React.createRef();
  inputRef.current['username'] = React.createRef();
  React.useEffect(()=>{

  },[])
  const onSubmit = data => {
      if(data.agree){
        if (validate(data.email, 'email') === false) {
          Toast.show('Please input correct email.', {})
        }
        else{


        }
      }
      else{

        let toast = Toast.show('Please agree the terms and conditions.', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          visible: true,
          backgroundColor: '#ff9d9d',
          textColor: '#000000',
          delay: 0,

        });
      }
  }

    const validateMobileNo = async(value) =>{
      if(value !== ""){
        setValidatingMessageText('Validating mobile no.')
        setVisible(true)
        useJwt.post("drivers/Authentication/check_mobile_no_exist",{'mobile_no':value}).then((res)=>{
          setVisible(false)
        }).catch((error)=>{
          formMethods.setValue('mobile_no','');
          formMethods.setError('mobile_no');
          inputRef.current['number'].focus();
          Toast.show('Please use another mobile number.')
          setVisible(false)
        })
      }

    }

    const validateEmail =(value) =>{

      if(value !== ""){
        setValidatingMessageText('Validating email.')
        setVisible(true)
        useJwt.post("drivers/Authentication/check_email_exist",{'email':value}).then((res)=>{

          setVisible(false)
        }).catch((error)=>{
          formMethods.setValue('email','');
          formMethods.setError('email');
          inputRef.current['email'].focus();
          Toast.show('Please use another email.')
          setVisible(false)
        })
    }
  }

  const validateUsername =(value) =>{
    if(value !== ""){
      setValidatingMessageText('Validating username.')
      setVisible(true)
      useJwt.post("drivers/Authentication/check_username_exist",{'username':value}).then((res)=>{
        setVisible(false)
      }).catch((error)=>{
        formMethods.setValue('username','');
        formMethods.setError('username');
        inputRef.current['username'].focus();
        Toast.show('Please use another username.')
        setVisible(false)
      })
    }
  }

  return(
    <>
      <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen}} >

          {/* Sign In */}
          <View style={{padding:30,...theme.pt_40,...theme.mt_20}}>
          <Text style={{...theme.f_32, ...theme.black, fontWeight:'bold'}}>Create Account</Text>
          <Text style={{...theme.f_18,...theme.gray}}>Let's get started</Text>
            <FormProvider {...formMethods}>
              <ThemeInput
                MainConatainerStyle={{marginTop:25}}
                InputConatainerStyle={{...theme.w_80}}
                Label="Mobile"
                TextInput={{
                  placeholder:'',
                  textContentType:'password',
                  keyboardType:'numeric',
                  onEndEditing: ()=> {
                    validateMobileNo(formMethods.getValues('mobile_no'));
                  },
                  ref: (input) => inputRef.current['number'] = input
                }}
                name='mobile_no'
                defaultValue=""
                rules={{required:true}}
                error={formErrors.mobile_no}
              />
              <ThemeInput
                MainConatainerStyle={{marginTop:0}}
                InputConatainerStyle={{...theme.w_80}}
                Label="Email"
                TextInput={{
                  placeholder:'',
                  ref: (input) => inputRef.current['email'] = input,
                  onEndEditing: (e)=>{

                    if (validate(e.nativeEvent.text,'email') === false){
                      Toast.show("Please input correct email.", {backgroundColor: '#ff9d9d',textColor: '#000000',});
                    }else{
                      validateEmail(e.nativeEvent.text)
                    }
                  }
                }}
                name='email'
                defaultValue=""
                rules={{required:true}}
                error={formErrors.email}
              />
              <ThemeInput
                MainConatainerStyle={{marginTop:0}}
                InputConatainerStyle={{width:'85%'}}
                Label="Username"
                TextInput={{
                  placeholder:'',

                  ref: (input) => inputRef.current['username'] = input,
                  onEndEditing: (e)=>{
                    validateUsername(e.nativeEvent.text)
                  }
                }}
                name='username'
                defaultValue=""
                rules={{ required: true }}
                error={formErrors.username}
              />
              <ThemeInput
                MainConatainerStyle={{ marginTop: 0 }}
                InputConatainerStyle={{ width: '85%' }}
                Label="Password"
                TextInput={{
                  placeholder: '',
                  textContentType: 'password',
                  secureTextEntry: passwordView
                }}
                IconRight={<Icon onPress={() => { setPassworView(!passwordView) }} name='eye-outline' type='ionicon' color='gray' />}
                name='password'
                defaultValue=""
                rules={{ required: true }}
                error={formErrors.password}
              />
              <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                <ThemeCheckBox LabelProps={{...theme.black.color}} hooks={true} label={<Text>I agree with <Text style={{...theme.orange}}>terms of use</Text></Text>} sethookValue={formMethods.setValue} name={'agree'} />
              </View>

            </FormProvider>
            <View >
              <ThemeButton text="CREATE" onPressAction={formMethods.handleSubmit(onSubmit)} />
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
                      }}>Already have an account? </Text>
                    <TouchableOpacity onPress={()=>{props.navigation.navigate('Login')}}>
                      <Text style={{
                        ...theme.orange,
                        ...theme.f_16
                        }}>
                          Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
          </View>
          <Overlay isVisible={visible} >
              <ActivityIndicator size="large" color={theme.purple.color}  />
              <Text>{validatingMessageText}</Text>
          </Overlay>
        </LinearGradient>

    </>
    )
  }
const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions

  }
}
const mapStateToProps = (state)=> {
  const { signup } = state
  return { signup: signup }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUp)