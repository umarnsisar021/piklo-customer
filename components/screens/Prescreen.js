
import * as React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';

import { Icon, Overlay } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";
import ThemeInput from '../theme/form/Input'
import ThemeCheckBox from '../theme/form/CheckBox'
import ThemeButton from '../theme/buttons'
import theme from '../theme/style.js'
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import { validate } from '../util/fn'
import useJwt from '../util/util';
import { StatusBar } from 'expo-status-bar';
import splash_cat from '../../assets/app/splash.png';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Prescreen(props) {


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
    inputRef.current['first_name'] = React.createRef();
    inputRef.current['last_name'] = React.createRef();
    inputRef.current['mobile_no'] = React.createRef();
    inputRef.current['email'] = React.createRef();
    inputRef.current['username'] = React.createRef();
    React.useEffect(() => {

    }, [])


    return (
            <View  >
                <StatusBar translucent backgroundColor="transparent" />
            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }} id='Main-page' colors={['#ffffff', '#ffffff']} >
                    <Image style={{ width: 180, height: 180, resizeMode: 'contain', }} source={splash_cat}></Image>
                    <Text style={{ fontSize: 25, color: 'black', fontFamily: 'Barlow_SemiBold', marginTop: 100, }}>Welcome to Piklo!</Text>
                    <View style={{ ...theme.row, marginTop: 20,}}>
                        <ThemeButton
                            onPressAction={()=>{props.navigation.navigate('Login')}}
                            style={{ width: '40%',}} height={40} textStyle={{ fontSize: 18, fontWeight: '500' }}>Login</ThemeButton>
                        <ThemeButton
                            elevation={3}
                            onPressAction={() => { props.navigation.navigate('SignUp')}}
                            style={{ width: '40%', }} height={40} textStyle={{ fontSize: 18, fontWeight: '500' }}>Register</ThemeButton>
                    </View>

                </View>
            </View >
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions

    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}
export default connect(mapStateToProps, mapDispatchToProps)(Prescreen)