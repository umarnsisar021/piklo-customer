
import * as React from 'react';
import { Text, TouchableOpacity, View, Image, StatusBar, Dimensions, Platform } from 'react-native';

import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";

//import {Verify} from '../verify/verify'

// Theme Elements
import StepList from '../../theme/StepList'
import theme from '../../theme/style'
import SCREEN_HEADER from '../../../assets/app/header_branding_1.png'
import { Button } from 'react-native';
import { connect } from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function DriverRegistration(props) {
    const formMethods = useForm();
    const onSubmit = data => console.log(data);

    return (<>


        <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{...theme.main_screen}} >
            <View style={{ padding: 30 , marginTop:30 }}>
                <Text style={{ ...theme.f_32, ...theme.black,...theme.heading_font}}>Driver Registration</Text>
                <Text style={{ ...theme.f_16, ...theme.gray }}>Give us a bit more information and {"\n"}
                    <Text style={{ ...theme.f_16, ...theme.orange }}>start earning immediately!</Text>
                </Text>
            </View>
            <View
                style={{
                    ...theme.p_30,
                    ...theme.py_15
                }} >
                <StepList
                    onPress={() => { props.navigation.navigate('Personalnformation') }}
                    name="Personal Information"
                    bulletNumber='1'
                    status={Object.keys(props.signup.step_1).length > 0 ? 'Completed' : 'Incomplete'}
                    statusColor={Object.keys(props.signup.step_1).length > 0 ? '#449284' : '#E66A71'}
                />
                <StepList
                    onPress={() => { props.navigation.navigate('IdentityAndDocuments') }}
                    name="Identities & Documents" bulletNumber='2'
                    status={Object.keys(props.signup.step_2).length > 0 ? 'Completed' : 'Incomplete'}
                    statusColor={Object.keys(props.signup.step_2).length > 0 ? '#449284' : '#E66A71'}
                />
                <StepList
                    onPress={() => { props.navigation.navigate('VehicleInformation') }}
                    name="Vehicle Information"
                    status={Object.keys(props.signup.step_3).length > 0 ? 'Completed' : 'Incomplete'}
                    bulletNumber='3'
                    statusColor={Object.keys(props.signup.step_3).length > 0 ? '#449284' : '#E66A71'} />
                <StepList
                    onPress={() => { props.navigation.navigate('BankInformation') }}
                    status={Object.keys(props.signup.step_4).length > 0 ? 'Completed' : 'Incomplete'}
                    statusColor={Object.keys(props.signup.step_4).length > 0 ? '#449284' : '#E66A71'}
                    name="Bank Information" bulletNumber='4' />
                <StepList
                    onPress={() => { props.navigation.navigate('Terms') }}
                    status={Object.keys(props.signup.step_4).length > 0 ? 'Completed' : 'Incomplete'}
                    statusColor={Object.keys(props.signup.step_4).length > 0 ? '#449284' : '#E66A71'}
                    name="Terms of Use" bulletNumber='5' />
            </View>

        </View>

    </>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setSignUpStep_1: (data) => dispatch({ type: 'SET_SIGNUP_BASIC', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}
export default connect(mapStateToProps, mapDispatchToProps)(DriverRegistration)