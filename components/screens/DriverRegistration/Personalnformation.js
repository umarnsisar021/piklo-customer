
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";
import Toast from 'react-native-root-toast';
import * as ImagePicker from 'expo-image-picker';
// Theme Elements
import ScreenLoader from '../component/ScreenLoader'
import ThemeInput from '../../theme/form/Input'
import ThemeButton from '../../theme/buttons'
import Dropdown from '../../theme/form/Dropdown'
import ThemeDateTimePicker from '../../theme/form/ThemeDateTimePicker'
import theme from '../../theme/style'
import useJwt from '../../util/util';
import { connect } from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import profile from '../../../assets/app/profile-black.png';
async function getCountries(params) {
    let data  = [];
    await useJwt.get('Common/countries').then((res) => {
        Object.values(res.data.data.countries).map((v)=>{
            data.push({ value: v.id, label: v.nationality});
        })
    })
    return data;
}
async function getCities(params) {
    let data = [];
    await useJwt.get('Common/cities').then((res) => {
        Object.values(res.data.data.cities).map((v) => {
            data.push({ value: v.id, label: v.name });
        })
    })
    return data;
}
const Personalnformation =(props)=> {
    const formMethods = useForm();
    const HeaderRef = React.useRef();
    let formErrors = formMethods.formState.errors;
    const [countries, setCountries] = React.useState(null);
    const [countriesData, setCountriesData] = React.useState([]);
    const [cities, setCities] = React.useState(null);
    const [citiesData, setCitiesData] = React.useState(null);
    const [loaded, setLoader] = React.useState(false);
    const [avatar, setAvatar] = React.useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
          base64:true
        });



        if (!result.cancelled) {
          formMethods.setValue('avatar', 'data:image/png;base64,'+result.base64)
          setAvatar('data:image/png;base64,'+result.base64);
        }
    };
    React.useEffect(()=>{

        const Run = async ()=>{
            let a = await getCountries();
            let b = await getCities();
            setCountriesData(a);
            setCitiesData(b);
            setLoader(true);
        }
        Run();
    },[])
    const onSubmit = data => {
        if(!avatar){
            let toast = Toast.show('Please select Profile image.', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                visible:true,
                backgroundColor: '#ff9d9d',
                textColor:'#000000',
            });
        }
        else{
             if(data) {
                props.setPersonalInformation(data);
                setTimeout(() => {
                    props.navigation.navigate('IdentityAndDocuments');
                }, 2000);
            }
        }

    }
    if(loaded){
        return (<>

            <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen }} >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 20  }} style={{ ...theme.px_30,marginTop:30 }}>
                    <View style={{marginTop:10}}>
                        <Text style={{ ...theme.f_30, ...theme.black,...theme.heading_font,  fontWeight: 'bold' }}>Personal Information</Text>
                        <Text style={{ ...theme.f_18, ...theme.orange }}>Step 1 / 5</Text>


                        <View style={{marginTop:20}}>
                            <Image style={{ width: 80, height: 80,borderRadius:50}} source={avatar !== null ? {uri: avatar}:  profile} />
                            <TouchableOpacity onPress={()=>pickImage()} style={{ position: 'absolute', bottom: 0, left: 50, backgroundColor:theme.purple.color,borderRadius:50,padding: 2,}}>
                                <Icon type="feather" name="plus" color="white" size={18} style={{}} />
                            </TouchableOpacity>

                        </View>
                        <FormProvider {...formMethods}>

                            <ThemeInput
                                MainConatainerStyle={{ marginTop: 25 }}
                                InputConatainerStyle={{ width: '80%' }}
                                Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'First Name',
                                }}
                                name='first_name'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.first_name}
                            />
                            <ThemeInput
                                MainConatainerStyle={{}}
                                InputConatainerStyle={{ width: '80%' }}
                                Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'Middle Name',
                                }}
                                name='middle_name'
                                defaultValue=""


                            />
                            <ThemeInput
                                MainConatainerStyle={{}}
                                InputConatainerStyle={{ width: '80%' }}
                                Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'Last Name',
                                }}
                                name='last_name'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.last_name}
                            />
                            <ThemeInput
                                MainConatainerStyle={{}}
                                InputConatainerStyle={{ width: '80%' }}
                                Icon={<Icon name='apps-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'Mobile Number',
                                    keyboardType: 'numeric'
                                }}
                                name='mobile_no'
                                defaultValue={props.signup.signUp_basic.mobile_no}
                                rules={{ required: true }}
                                error={formErrors.mobile_no}
                            />



                            <View style={{ ...theme.row, ...theme.jc_space_between, }}>
                                <Dropdown
                                    MainConatainerStyle={{ width: '48%', marginTop: 0 }}
                                    InputConatainerStyle={{ width: '100%' }}
                                    Icon={<Icon name='man-outline' type='ionicon' color='#449284' />}
                                    TextInput={{
                                        placeholder: 'Gender',
                                    }}
                                    name='gender'
                                    defaultValue=""
                                    items={[{ value: '1', label: 'Male', }, { value: '2', label: 'Female', }]}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    error={formErrors.gender}
                                />
                                <ThemeDateTimePicker
                                    MainConatainerStyle={{ width: '48%', marginTop: 0 }}
                                    InputConatainerStyle={{ width: '80%' }}
                                    Icon={<Icon name='calendar-outline' type='ionicon' color='#449284' />}
                                    TextInput={{
                                        placeholder: 'Date of Birth',
                                        textContentType: 'password',
                                    }}
                                    name='dob'
                                    defaultValue=""
                                    rules={{ required: true }}
                                    error={formErrors.dob}
                                />
                            </View>
                            <View style={{ ...theme.row, ...theme.jc_space_between, }}>
                                <Dropdown
                                    MainConatainerStyle={{ width: '48%', marginTop: 0 }}
                                    InputConatainerStyle={{ width: '100%' }}
                                    Icon={<Icon name='man-outline' type='ionicon' color='#449284' />}
                                    TextInput={{
                                        placeholder: 'Nationality',
                                        searchable: true,
                                        itemSeparator:true,
                                        searchTextInputProps:{
                                            style: { borderRadius: 0, width: '90%', color:'#FFA253'}
                                        },
                                        searchContainerStyle:{
                                            borderBottomColor: "#FFA253"
                                        },
                                        itemSeparatorStyle:{
                                            borderBottomColor: "#E9E8E8",
                                            borderBottomWidth: 1,
                                        },
                                        selectedItemLabelStyle:{
                                            color:"#FFA253"
                                        }
                                    }}
                                    name='nationality_id'
                                    defaultValue=""
                                    items={countriesData}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    error={formErrors.nationality_id}
                                />
                                <Dropdown
                                    MainConatainerStyle={{ width: '48%', marginTop: 0 }}
                                    InputConatainerStyle={{ width: '100%' }}
                                    Icon={<Icon name='man-outline' type='ionicon' color='#449284' />}
                                    TextInput={{
                                        placeholder: 'City',
                                        searchable:true,
                                        itemSeparator: true,
                                        searchTextInputProps: {
                                            style: { borderRadius: 0, width: '90%', color: '#FFA253' }
                                        },
                                        searchContainerStyle: {
                                            borderBottomColor: "#FFA253"
                                        },
                                        itemSeparatorStyle: {
                                            borderBottomColor: "#E9E8E8",
                                            borderBottomWidth: 1,
                                        },
                                        selectedItemLabelStyle: {
                                            color: "#FFA253"
                                        }
                                    }}
                                    name='city_id'
                                    defaultValue=""
                                    items={citiesData}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    error={formErrors.city_id}
                                />
                            </View>
                        </FormProvider>
                    </View>
                    <View
                        style={{
                            ...theme.w_100,
                            ...theme.p_30,
                            ...theme.align_center,

                        }}>
                        <View style={{
                            ...theme.row,
                            ...theme.align_center,
                        }}>
                            <ThemeButton style={{ width: '100%' }} text="PROCEED TO REGISTRATION" onPressAction={formMethods.handleSubmit(onSubmit)} />
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
        setPersonalInformation: (data) => dispatch({ type: 'SET_SIGNUP_STEP_1', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personalnformation)