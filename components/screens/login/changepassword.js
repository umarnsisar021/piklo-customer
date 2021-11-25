
import * as React from 'react';
import { Text, TouchableOpacity, View, Image,StatusBar,Dimensions} from 'react-native';
import styles from './styles';

import { Icon } from 'react-native-elements';
import { useForm, Controller,FormProvider } from "react-hook-form";

//import {Verify} from '../verify/verify'

// Theme Elements
import ThemeInput from '../../theme/form/Input'
import theme from '../../theme/style'
import SCREEN_HEADER from '../../../assets/app/header_branding_1.png'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default  function ChangePassword (props){
  const formMethods = useForm();
  const onSubmit = data => console.log(data);
  const [passwordView, setPassworView] = React.useState(true);
  const [confirmPasswordView, setConfirmPassworView] = React.useState(true);
  const getInputValue =(value) =>{
    console.log(value)
  }
  return(
    <>
    <StatusBar backgroundColor="#126D5D" barStyle={'light-content'} />

      <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen}} >



          <View style={{padding:30}}>
          <Text style={{ ...theme.f_32, ...theme.orange }}>Change Password</Text>
          <Text style={{ ...theme.f_18, ...theme.gray }}>Enter new credentials</Text>
            <FormProvider {...formMethods}>
              <ThemeInput
                MainContainerStyle={{marginTop:25}}
                InputConatainerStyle={{ width: '85%' }}
                Icon={<Icon name='lock-open-outline' type='ionicon' color='#449284'  />}
                TextInput={{
                  placeholder: 'New Password',
                  textContentType: 'password',
                  secureTextEntry: passwordView
                }}
                name='myfield'
                defaultValue=""
                IconRight={<Icon onPress={() => { setPassworView(!passwordView) }} name='eye-outline' type='ionicon' color='gray' />}
              />
               <ThemeInput
                MainContainerStyle={{marginTop:0}}
                InputConatainerStyle={{ width: '85%' }}
                Icon={<Icon name='lock-open-outline' type='ionicon' color='#449284'  />}
                TextInput={{
                  placeholder: 'New Password',
                  textContentType: 'password',
                  secureTextEntry: confirmPasswordView
                }}
                name='myfield'
                defaultValue=""
                IconRight={<Icon onPress={() => { setConfirmPassworView(!confirmPasswordView) }} name='eye-outline' type='ionicon' color='gray' />}
              />
            </FormProvider>
            <TouchableOpacity onPress={()=>{props.navigation.navigate('VerifyMobile')}} style={{width:'100%',backgroundColor:'#449284',padding:15,marginTop:20,alignItems:'center',borderRadius:5}}>
                  <Text style={{color:'white'}}>CHANGE</Text>
            </TouchableOpacity>

          </View>
          <View style={{ ...theme.w_100,...theme.p_10,...theme.align_center }}>
          <Icon onPress={() => { props.navigation.goBack(null) }} reverse name='chevron-back-outline' type='ionicon' color='#449284' />
          </View>
        </View>

    </>
    )
  }
