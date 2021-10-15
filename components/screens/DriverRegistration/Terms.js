
import * as React from 'react';
import { Text,ActivityIndicator, ScrollView, TouchableOpacity, View, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller, FormProvider } from "react-hook-form";
import {  Overlay } from 'react-native-elements';
// Theme Elements
import ThemeInput from '../../theme/form/Input'
import ThemeCheckBox from '../../theme/form/CheckBox'
import ThemeButton from '../../theme/buttons'
import theme from '../../theme/style'
import ScreenLoader from '../component/ScreenLoader'
import { Button } from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import useJwt from '../../util/util';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
 function Terms(props) {
    const formMethods = useForm();
    let formErrors = formMethods.formState.errors;
    const [loaded, setLoaded] = React.useState(false);
    let inputRef = React.useRef();
    const [visible, setVisible] = React.useState(false);
    const toggleOverlay = () => {
      setVisible(!visible);
    };
    React.useEffect(()=>{
        setTimeout(()=>{
            setLoaded(true)
        },1000)
        inputRef.current = {};
        inputRef.current['number_plate'] = React.createRef();
    })
    const onSubmit =async (data) => {

        if(data.accept == ''){
            Toast.show('Please accept terms and condition to continue.', {backgroundColor:'#ff9d9d',color:"black"});
        }else{
            if(Object.keys(props.signup.signUp_basic).length > 0 && Object.keys(props.signup.step_1).length > 0 && Object.keys(props.signup.step_2).length > 0 && Object.keys(props.signup.step_3).length > 0 && Object.keys(props.signup.step_4).length > 0){
                let data= {...props.signup.signUp_basic, ...props.signup.step_1 ,  ...props.signup.step_3 ,...props.signup.step_4};

                useJwt.post('drivers/Authentication/signup',{...data}).then((res)=>{
                    if(res.status == 200){
                        props.navigation.navigate('RegistrationMessage')
                    }
                }).catch((error)=>{
                    if (error.response) {
                        // Request made and server responded
                        Toast.show(error.response.data.message, {backgroundColor: '#ff9d9d',textColor:'#000000',});
                    }
                })
            }
            else{
                Toast.show('Please fill the complete form.', {backgroundColor:'#ff9d9d',textColor:'#000000',});
            }
            // useJwt.post('drivers/Authentication/signup').then((res)=>{

            // }).catch((error)=>{
            //     if (error.response) {
            //         Toast.show(error.response.message, {backgroundColor:'ff9d9d'});
            //     }
            // })
        }

        //props.navigation.navigate('Terms');
    }

    if(loaded){
        return (<>

            <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{...theme.main_screen}} >

                <ScrollView style={{ ...theme.px_30, ...theme.py_20,...theme.mt_40,marginBottom:120,paddingBottom:120}}>
                    <Text style={{ ...theme.f_30,...theme.black, fontWeight: 'bold' }}>Terms of Use</Text>
                    <Text style={{ ...theme.f_18, ...theme.orange }}>Step 5 / 5</Text>

                    <FormProvider  {...formMethods}>
                        <Text style={{...theme.gray, ...theme.py_10 ,...theme.f_14}}>
                            Terms of service are the legal agreements between
                            a service provider and a person who wants to use
                            that service. The person must agree to abide by the
                            terms of service in order to use the offered service.
                            Terms of service can also be merely a disclaimer,
                            especially regarding the use of websites
                        </Text>
                        <Text style={{ ...theme.gray, ...theme.py_10,...theme.f_14}}>
                            Terms of service are the legal agreements between
                            a service provider and a person who wants to use
                            that service. The person must agree to abide by the
                            terms of service in order to use the offered service.
                            Terms of service can also be merely a disclaimer,
                            especially regarding the use of websites
                        </Text>
                        <Text style={{ ...theme.gray, ...theme.py_10, ...theme.f_14}}>
                            Terms of service are the legal agreements between
                            a service provider and a person who wants to use
                            that service.
                        </Text>
                        <ThemeCheckBox
                            LabelProps={{ style: { color: '#449284' } }}
                            hooks={true}
                            error={formErrors.accept}
                            rules={{required:true}}
                            label={<Text>I agree with <Text style={{ color: '#F58220' }}>terms of use</Text></Text>}
                            sethookValue={formMethods.setValue} name={'accept'} />

                    </FormProvider>
                    <View style={{...theme.hp_50}} />
                    <View
                    style={{
                        ...theme.w_100,
                        ...theme.align_center,

                    }}>
                    <View style={{
                        ...theme.row,
                        ...theme.align_center,
                    }}>

    <ThemeButton  style={{ width: '100%' }} text="SUBMIT" onPressAction={formMethods.handleSubmit(onSubmit)} />
                    </View>
                </View>
                </ScrollView>


                <Overlay isVisible={visible} >
                    <ActivityIndicator size="large" color="#FFA253"  />
                    <Text>Submitting your request.</Text>
                </Overlay>
            </LinearGradient>

        </>
        )
    }
    else{
        return <ScreenLoader />
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setTerms: (data) => dispatch({ type: 'SET_SIGNUP_STEP_4', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}

export default connect(mapStateToProps,mapDispatchToProps)(Terms)