
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";
import Toast from 'react-native-root-toast';

// Theme Elements
import ThemeInput from '../../theme/form/Input'
import ThemeSelect from '../../theme/form/Select'
import ThemeButton from '../../theme/buttons'
import theme from '../../theme/style'
import ScreenLoader from '../component/ScreenLoader'
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function VehicleInformation(props) {
    const formMethods = useForm();
    const [loaded, setLoaded] = React.useState(false);
    let inputRef = React.useRef();
    let formErrors = formMethods.formState.errors;
    React.useEffect(()=>{
        setTimeout(()=>{
            setLoaded(true)
        },1500)
        inputRef.current = {};
        inputRef.current['number_plate'] = React.createRef();
    })
    const onSubmit =async (data) => {
        await props.setVehicleInformation(data);
        Toast.show('Saved.', {});
        props.navigation.navigate('BankInformation');
    }
    if(loaded){
        return (<>


            <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{...theme.main_screen}} >

                <ScrollView style={{ ...theme.px_30, ...theme.py_20, ...theme.mt_40}}>
                    <Text style={{ ...theme.f_30, ...theme.black, fontWeight: 'bold' }}>Vehicle Information</Text>
                    <Text style={{ ...theme.f_18, ...theme.orange }}>Step 3 / 5</Text>

                    <FormProvider  {...formMethods}>
                        <ThemeInput
                            MainConatainerStyle={{...theme.mt_25}}
                            InputConatainerStyle={{ width: '80%' }}
                            Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                            TextInput={{
                                placeholder: 'Number Plate ',
                                autoCapitalize:'characters',
                                ref: (input) => inputRef.current['number_plate'] = input
                            }}
                            name='number_plate'
                            defaultValue=""
                            rules={{ required: true }}
                            error={formErrors.number_plate}
                        />
                        <ThemeSelect
                            items={[{ value: 'Bike', label: 'Bike' }, { value: 'Car', label: 'Car' }, { value: 'Truck', label: 'Truck' }]}
                            MainConatainerStyle={{ ...theme.my_10 ,...theme.px_10}}
                            InputConatainerStyle={{ width: '100%' }}
                            TextInput={{
                                placeholder: 'Type',

                            }}
                            name='type'
                            defaultValue="Bike"
                            rules={{ required: true }}
                            error={formErrors.type}
                        />
                        <ThemeInput
                            MainConatainerStyle={{ ...theme.my_10 }}
                            InputConatainerStyle={{ width: '80%' }}
                            Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                            TextInput={{
                                placeholder: 'Brand ',
                                autoCapitalize:'characters'
                            }}
                            name='brand'
                            defaultValue=""
                            rules={{ required: true }}
                            error={formErrors.brand}
                        />
                        <ThemeInput
                            MainConatainerStyle={{ ...theme.my_10 }}
                            InputConatainerStyle={{ width: '80%' }}
                            Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                            TextInput={{
                                placeholder: 'Make',
                                autoCapitalize:'characters'
                            }}
                            name='make'
                            defaultValue=""
                            rules={{ required: true }}
                            error={formErrors.make}
                        />
                        <ThemeInput
                            MainConatainerStyle={{ ...theme.my_10 }}
                            InputConatainerStyle={{ width: '80%' }}
                            Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                            TextInput={{
                                placeholder: 'Model',
                                autoCapitalize:'characters'
                            }}
                            name='model'
                            defaultValue=""
                            rules={{ required: true }}
                            error={formErrors.model}
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
                            <ThemeButton  style={{ width: '100%' }} text="NEXT STEP - BANK INFORMATION" onPressAction={formMethods.handleSubmit(onSubmit)} />
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
        setVehicleInformation: (data) => dispatch({ type: 'SET_SIGNUP_STEP_3', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicleInformation)