
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";
// Theme Elements
import ThemeInput from '../../theme/form/Input'
import ThemeButton from '../../theme/buttons'
import theme from '../../theme/style'
import ScreenLoader from '../component/ScreenLoader'
import Toast from 'react-native-root-toast';
import { Button } from 'react-native';
import { connect } from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function BankInformation(props) {
    const formMethods = useForm();
    let formErrors = formMethods.formState.errors;
    const [loaded, setLoaded] = React.useState(false);
    let inputRef = React.useRef();
    React.useEffect(()=>{
        setTimeout(()=>{
            setLoaded(true)
        },1000)
        inputRef.current = {};
        inputRef.current['number_plate'] = React.createRef();
    })
    const onSubmit =async (data) => {
        await props.setBankInformation(data);
        Toast.show('Saved.', {});
        props.navigation.navigate('Terms');
    }
    if(loaded){
        return (<>

            <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{...theme.main_screen}} >
                <ScrollView style={{ ...theme.px_30, ...theme.py_20, ...theme.mt_40}}>
                    <Text style={{ ...theme.f_30,...theme.black, fontWeight: 'bold' }}>Bank Information</Text>
                    <Text style={{ ...theme.f_18, ...theme.orange }}>Step 4 / 5</Text>

                    <FormProvider  {...formMethods}>
                        <ThemeInput
                            MainConatainerStyle={{...theme.mt_25}}
                            InputConatainerStyle={{ width: '80%' }}
                            Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                            TextInput={{
                                placeholder: 'Bank Name',
                                autoCapitalize:'characters',
                            }}
                            name='bank_name'
                            defaultValue=""
                            rules={{ required: true }}
                            error={formErrors.bank_name}
                        />
                        <ThemeInput
                            MainConatainerStyle={{ ...theme.my_10 }}
                            InputConatainerStyle={{ width: '80%' }}
                            Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                            TextInput={{
                                placeholder: 'Account Number',
                                autoCapitalize:'characters',
                                keyboardType:"numeric"
                            }}
                            name='account_no'
                            defaultValue=""
                            rules={{ required: true }}
                            error={formErrors.account_no}
                        />
                        <ThemeInput
                            MainConatainerStyle={{ ...theme.my_10 }}
                            InputConatainerStyle={{ width: '80%' }}
                            Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                            TextInput={{
                                placeholder: 'IBAN',
                                autoCapitalize:'characters',
                            }}
                            name='iban'
                            defaultValue=""
                            rules={{ required: true }}
                            error={formErrors.iban}
                        />


                    </FormProvider>
                    <View
                        style={{
                            ...theme.w_100,
                            ...theme.py_40,
                            ...theme.align_center,
                        }}>
                        <View style={{
                            ...theme.row,
                            ...theme.align_center,
                        }}>
                            <ThemeButton  style={{ width: '100%' }} text="NEXT STEP - TERMS OF USE" onPressAction={formMethods.handleSubmit(onSubmit)} />

                        </View>
                    </View>
                </ScrollView>



            </LinearGradient>

        </>
        )
    }
    else{
        return <ScreenLoader />;
    }

}


const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setBankInformation: (data) => dispatch({ type: 'SET_SIGNUP_STEP_4', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}

export default connect(mapStateToProps, mapDispatchToProps)(BankInformation)