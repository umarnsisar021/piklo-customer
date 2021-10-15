
import * as React from 'react';
import { Text, TouchableOpacity, View, Image,StatusBar,Dimensions} from 'react-native';
import styles from './styles';

import { LinearGradient } from 'expo-linear-gradient';
import ElevatedView from 'react-native-elevated-view';
import { Icon } from 'react-native-elements';
import { useForm, Controller,FormProvider } from "react-hook-form";
//import {Verify} from '../verify/verify'

// Theme Elements
import ThemeInput from '../../theme/form/Input'
import theme from '../../theme/style'
import SCREEN_HEADER from '../../../assets/app/header_branding_1.png'
import nine_box from '../../../assets/icons/9box.png'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default  function ForgotPassword (props){
  //const { control, handleSubmit, formState: { errors } } = useForm();
  const formMethods = useForm();
  const [passwordView, setPassworView] = React.useState(true);
  const onSubmit = data => console.log(data);

  const getInputValue =(value) =>{
    console.log(value)
  }
  return(
    <>
    <StatusBar backgroundColor="#126D5D" barStyle={'light-content'} />

      <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen}} >

          <View>
            <Image source={SCREEN_HEADER}  style={{width:windowWidth,resizeMode:'contain'}} />
          </View>
          {/* Sign In */}
          <View style={{padding:30}}>
          <Text style={{ ...theme.f_32, ...theme.orange }}>Forgot Password</Text>
          <Text style={{ ...theme.f_18, ...theme.gray }}>Enter associated email address</Text>
            <FormProvider {...formMethods}>
              <ThemeInput
                MainConatainerStyle={{marginTop:25}}
                InputConatainerStyle={{width:'80%'}}
                Icon={<Icon name='apps-outline' type='ionicon' color='#449284'  />}
                TextInput={{
                  placeholder:'Mobile No',
                  textContentType:'password',
                }}
                name='myfield'
                defaultValue=""
              />
            </FormProvider>
            <TouchableOpacity onPress={()=>{props.navigation.navigate('VerifyMobile')}} style={{width:'100%',backgroundColor:'#449284',padding:15,marginTop:20,alignItems:'center',borderRadius:5}}>
                  <Text style={{color:'white'}}>SEND</Text>
            </TouchableOpacity>

          </View>
          <View style={{width:'100%',padding:30,alignItems:'center',}}>
                <View>
                  <Text style={{color:'#707070',fontSize:16,alignSelf:'center',textAlign:'center'}}>We will email you a link
to reset your password</Text>
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
        </LinearGradient>

    </>
    )
  }
