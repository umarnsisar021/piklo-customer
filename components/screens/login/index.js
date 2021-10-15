
import * as React from 'react';
import { Text, TouchableOpacity, View, StatusBar , Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm,FormProvider } from "react-hook-form";
import Constants from 'expo-constants';
import Toast from 'react-native-root-toast';
import useJwt from '../../util/util'
import firebase from '../../firebase';
// Theme Elements
import ThemeInput from '../../theme/form/Input'
import ThemeCheckBox from '../../theme/form/CheckBox'
import theme from '../../theme/style.js'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import GradientButton from 'react-native-gradient-buttons';
import ThemeButton from '../../theme/buttons';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import * as Google from 'expo-google-app-auth';
// import * as Facebook from 'expo-facebook';
// import appleAuth, {
//   AppleButton,
//   AppleAuthError,
//   AppleAuthRequestScope,
//   AppleAuthRequestOperation,
// } from 'react-native-apple-authentication'
const isInClient = Constants.appOwnership === 'expo';
function Login (props){
  const formMethods = useForm();
  const [passwordView, setPasswordView] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  let formErrors = formMethods.formState.errors;

  const togglePassword= ()=>{
      if(passwordView){
        setPasswordView(false)
      }
      else{
        setPasswordView(true)
      }
  }

  const onSubmit = async data => {
    setVisible(true);
    data["device_id"] = props.user.device_id;
    await useJwt.setRefreshCookies();
    await useJwt.storeData(null)
    await useJwt.post('drivers/Authentication/login',data).then(async (res)=>{

      if (res.status) {
        if(res.headers['set-cookie']){
            await useJwt.storeData(res.headers['set-cookie'])
            let c = await useJwt.getValue();
        }
        props.setUserData(res.data.data.user_detail)
        props.setToken(res.data.data.token)
        await useJwt.post('drivers/settings/get_my_profile',data).then(async (res1)=>{
           props.setUserProfile(res1.data.data)
           setVisible(false);
           props.setLogin(true)
        })

      }
    }).catch( (error)=>{
      setVisible(false);
      let toast = Toast.show(  error.response.data.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        visible:true,
        backgroundColor: '#ff9d9d',
        textColor:'#000000',
        delay: 0,

      });

    })

  }
  //key for google sign in
  const clientIdForUseInTheExpoClient = '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com';
  const getClintID = Platform.select({
    android: isInClient ? {
              androidClientId: clientIdForUseInTheExpoClient
            } : {
              androidClientId: '481191156568-13ff2us31i5r9bj6lek3755cd1ctkkni.apps.googleusercontent.com'
            },
    ios: isInClient ? {
      iosClientId: clientIdForUseInTheExpoClient
    } : {
        iosClientId: '481191156568-icrvnn6kqokg26qgf3paf6b3nptahq6h.apps.googleusercontent.com'
    },
  });


  //trigger for google sign in
  const signInAsync = async () => {
    const config ={
      ...getClintID,
      scopes: ['profile', 'email'],
    }
    const { type, accessToken, user } = await Google.logInAsync(config);
    if (type === 'success') {
      // Then you can use the Google REST API
      let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      let res = await  userInfoResponse.json()
    }
  };
  //trigger for google sign in
  const appleSignInAsync = async () => {
    try {

      // make sign in request and return a response object containing authentication data
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME
        ],
      });

      // retrieve identityToken from sign in request
      const {
        identityToken,
      } = appleAuthRequestResponse;

      // you may also want to send the device's ID to your server to link a device with the account
      //const deviceId = getUniqueId();

      // identityToken generated
      if (identityToken) {

        // send data to server for verification and sign in
        // const { ack, response } = await authFetch({
        //   url: 'sign-in-with-apple',
        //   body: {
        //     ...appleAuthRequestResponse,
        //     deviceId: deviceId
        //   }
        // });
        if (ack === 'success') {
          // successfully verified, handle sign in
          //await handleSignIn(response);
        }
      } else {
        // no token, failed sign in
      }

    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        // user cancelled Apple Sign-in
      } else {
        // other unknown error
      }
    }
  };

  // Facebook SignIn
  const facebookSignInAsync = async ()=>{
    try {
      await Facebook.initializeAsync({
        appId: '4629323113765111',
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile',"email"],
      });

      // if (type === 'success') {
      //   // Get the user's name using Facebook's Graph API
      //   const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      //   Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
      // } else {
      //   // type === 'cancel'
      // }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  React.useEffect(()=>{

  },[passwordView])



  const [phoneNumber, setPhoneNumber] = React.useState('+923132500948');
  const [code, setCode] = React.useState('321489');
  const [verificationId, setVerificationId] = React.useState(null);
  const recaptchaVerifier = React.useRef("AJOnW4SP49BvHut3dQY26hOqLT51yctb7BrDyqHQsuXm5sBSkqpOsYfB_oJr6fMlSriU7hjVojjqMEgUIr-ZVnMHDv2XrmBfL8tAx3dZrQw7pxZgPuPHhyTU_yJM_smN3efZZy2PH1J9SuLRI-RThgrFjSxCFoqLnA");
  // Function to be called when requesting for a verification code
  const sendVerification = () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then((res)=>{
        console.log(res)
      });

  };

  // Function to be called when confirming the verification code that we received
  // from Firebase via SMS
  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        // Do something with the results here
        console.log(result);
      });
  }

  return(

      <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={theme.main_screen} >

          <View>

          </View>
          {/* Sign In */}
          <View style={{padding:30}}>
          <Text
            style={{
              ...theme.f_32,
              ...theme.theme_heading_color,
              fontWeight:'bold',
              marginTop:30,
            }}>Sign In</Text>
          <Text
            style={{
              ...theme.f_18,
              ...theme.gray
              }}>Login to your account</Text>
            <FormProvider {...formMethods}>
              <ThemeInput
                MainConatainerStyle={{marginTop:25}}
                InputConatainerStyle={{width:'80%'}}
            Icon={<Icon name='apps-outline' type='ionicon' color={theme.black.color}  />}
                TextInput={{
                  placeholder:'',
                }}
                Label="Username/Email"
                name='username'
                defaultValue=""
                rules={{ required: true }}
                error={formErrors.password}
              />
              <ThemeInput
                MainConatainerStyle={{marginTop:10}}
                InputConatainerStyle={{ width: '85%' }}
                Label="Password"
                Icon={<Icon  name='lock-open-outline' type='ionicon' color={theme.black.color}  />}
                TextInput={{
                  placeholder:'',
                  textContentType:'password',
                  secureTextEntry:passwordView
                }}
                IconRight={<Icon onPress={()=>{togglePassword()}} name='eye-outline' type='ionicon' color='gray'  />}
                name='password'
                rules={{ required: true }}
                error={formErrors.password}
                defaultValue=""
              />
              <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                <ThemeCheckBox LabelProps={{ style: { ...theme.black}}} hooks={true} label={"Remember Me"} sethookValue={formMethods.setValue} name={'remember_me'} />
                  <View style={{}}>
                    <TouchableOpacity onPress={()=>{props.navigation.navigate('ForgotPassword')}}>
                      <Text style={{...theme.black}}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>
              </View>

            </FormProvider>

        <TouchableOpacity onPress={confirmCode}>
              <Text>Send Verification</Text>
            </TouchableOpacity>
            <ThemeButton style={{marginTop: 20,}}  text="LOGIN" onPressAction={formMethods.handleSubmit(onSubmit)} />

          </View>
          <View style={{width:'100%',padding:30,alignItems:'center',}}>
                <View>
            <Text style={{...theme.gray,...theme.f_16,alignSelf:'center'}}>or sign in with</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  {/* <Icon reverse onPress={() => { appleSignInAsync()}} name='logo-apple' type='ionicon' color='#333333'  /> */}
                  <Icon reverse onPress={() => { signInAsync()}} name='logo-google' type='ionicon' color='#DD272D'  />
                  <Icon reverse onPress={() => { facebookSignInAsync()}} name='logo-facebook' type='ionicon' color='#3A589B'  />
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
            }}>Don't have a account? </Text>
                  <TouchableOpacity onPress={()=>{props.navigation.navigate('SignUp')}}>
                    <Text style={{
                      ...theme.orange,
                      ...theme.f_16
                    }}>
                      Sign Up
                    </Text>
                </TouchableOpacity>
                </View>
          </View>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebase.app().options}
            />
          <Overlay isVisible={visible} >
              <ActivityIndicator size="large" color="#FFA253"  />
              <Text>Submitting your request.</Text>
          </Overlay>
        </LinearGradient>
    )
  }
const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    setUserData: (data) => dispatch({ type: 'SET_USER_DETAILS', payload: data }),
    setUserProfile: (data) => dispatch({ type: 'SET_USER_PROFILE', payload: data }),
    setUserId: (data) => dispatch({ type: 'SET_USER_ID', payload: data }),
    setLogin: (data) => dispatch({ type: 'SET_LOGIN', payload: data }),
    setToken: (data) => dispatch({ type: 'SET_TOKEN', payload: data }),
    loginCredentials: (data) => dispatch({ type: 'SET_LOGIN_CREDENTIALS', payload: data }),
  }
}
const mapStateToProps = (state) => {
  const { user } = state
  return { user: user }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)