
import * as React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon,Overlay } from 'react-native-elements';
import { useForm, Controller,FormProvider } from "react-hook-form";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

////// Theme Elements
import ThemeInput from '../../theme/form/Input'
import ThemeCheckBox from '../../theme/form/CheckBox'
import ThemeCountryDropdown from '../../theme/form/CountryDropdown'
import ThemeButton from '../../theme/buttons'
import theme from '../../theme/style.js'
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import { validate } from '../../util/fn'
import useJwt from '../../util/util';
import firebase from '../../firebase';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SignUp  (props){


  const formMethods = useForm();
  let formErrors = formMethods.formState.errors;
  const [visible, setVisible] = React.useState(false);
  const [validatingMessageText, setValidatingMessageText] = React.useState('');
  const [passwordView, setPassworView] = React.useState(true);
  /// Firebase Phone Auth States
  const recaptchaVerifier = React.useRef(null);

  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  ///

  let inputRef = React.useRef();
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  inputRef.current = {};
  inputRef.current['first_name'] = React.createRef();
  inputRef.current['last_name'] = React.createRef();
  inputRef.current['country_code'] = React.createRef();
  inputRef.current['mobile_no'] = React.createRef();
  inputRef.current['email'] = React.createRef();
  inputRef.current['username'] = React.createRef();
  React.useEffect(()=>{

  },[])
  const onSubmit =async data => {
      data["device_id"] = props.user.device_id;
      data["mobile_no"] = data["country_code"] + data["mobile_no"] ;
      if(data.agree){
        if (validate(data.email, 'email') === false) {
          Toast.show('Please input correct email.', {})
        }
        else{
          try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
             `+${data["mobile_no"]}`,
              recaptchaVerifier.current
            );

            props.setSignUpBasic(data);
            props.navigation.navigate('VerifyMobileSignUp', {
              data: { verificationId: verificationId, formData: data }
            })

          } catch (error) {
            console.log(error.message)
          }


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
              <View style={{ flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                {/* Field */}
                <ThemeInput
                  MainContainerStyle={{ marginTop: 25, width: '47%'}}
                  InputConatainerStyle={{width:'100%'}}
                  Label="First Name"
                  TextInput={{
                    placeholder: '',

                    ref: (input) => inputRef.current['first_name'] = input
                  }}
                  name='first_name'
                  defaultValue="Demo"
                  rules={{ required: true }}
                  error={formErrors.first_name}
                />
                {/* Field */}
                <ThemeInput
                  MainContainerStyle={{ marginTop: 25, width: '47%' }}
                  InputConatainerStyle={{ width: '100%' }}
                  Label="Last Name"
                  TextInput={{
                    placeholder: '',

                    ref: (input) => inputRef.current['last_name'] = input
                  }}
                  name='last_name'
                  defaultValue="Customer"
                  rules={{ required: true }}
                  error={formErrors.last_name}
                />
              </View>
              {/*  */}
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                {/* Field */}
                <ThemeCountryDropdown
                  pickerProps={{ countryCode: 'PK', withFilter: true,}}
                  MainContainerStyle={{ marginTop:0, width: '35%' }}
                  InputConatainerStyle={{ width: '100%' }}
                  Label="Country Code"
                  TextInput={{
                    placeholder: '',

                    ref: (input) => inputRef.current['country_code'] = input
                  }}
                  name='country_code'
                  defaultValue=""
                  rules={{ required: true }}
                  error={formErrors.country_code}
                />
                {/* Field */}
                <ThemeInput
                  MainContainerStyle={{ marginTop: 0 , width:"60%" }}
                  InputConatainerStyle={{ width: '100%' }}
                  Label="Mobile"
                  TextInput={{
                    placeholder: '',
                    textContentType: 'password',
                    keyboardType: 'numeric',
                    onEndEditing: () => {
                      validateMobileNo(formMethods.getValues('country_code') + formMethods.getValues('mobile_no'));
                    },
                    ref: (input) => inputRef.current['number'] = input
                  }}
                  name='mobile_no'
                  defaultValue="3132500948"
                  rules={{ required: true }}
                  error={formErrors.mobile_no}
                />
              </View>
              {/*  */}


              <ThemeInput
                MainContainerStyle={{marginTop:0}}
                InputConatainerStyle={{ width: '100%' }}
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
                defaultValue="democustomer@gmail.com"
                rules={{required:true}}
                error={formErrors.email}
              />
              <ThemeInput
                MainContainerStyle={{marginTop:0}}
                InputConatainerStyle={{ width: '100%' }}
                Label="Username"
                TextInput={{
                  placeholder:'',

                  ref: (input) => inputRef.current['username'] = input,
                  onEndEditing: (e)=>{
                    validateUsername(e.nativeEvent.text)
                  }
                }}
                name='username'
                defaultValue="democustomer"
                rules={{ required: true }}
                error={formErrors.username}
              />
              <ThemeInput
                MainContainerStyle={{ marginTop: 0 }}
                InputConatainerStyle={{ width: '85%' }}
                Label="Password"
                TextInput={{
                  placeholder: '',
                  textContentType: 'password',
                  secureTextEntry: passwordView
                }}
                IconRight={<Icon onPress={() => { setPassworView(!passwordView) }} name='eye-outline' type='ionicon' color='gray' />}
                name='password'
                defaultValue="123456"
                rules={{ required: true }}
                error={formErrors.password}
              />
              <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                <ThemeCheckBox LabelProps={{...theme.black.color}} hooks={true} label={<Text>I agree with <Text style={{...theme.orange}}>terms of use</Text></Text>} sethookValue={formMethods.setValue} name={'agree'} />
              </View>

            </FormProvider>
            <View >
              <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
              />
              <ThemeButton text="CREATE" onPressAction={formMethods.handleSubmit(onSubmit)} />
            </View>
          </View>


          <View
            style={{
              ...theme.w_100,
              ...theme.p_5,
              ...theme.align_center,

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
    setSignUpBasic: (data) => dispatch({ type: 'SET_SIGNUP_BASIC', payload: data }),
  }
}
const mapStateToProps = (state)=> {
  const { signup ,user } = state
  return { signup: signup, user: user}
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUp)