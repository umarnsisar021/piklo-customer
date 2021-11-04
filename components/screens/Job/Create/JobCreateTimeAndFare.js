
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Dimensions, Platform, StyleSheet, SafeAreaView, } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Theme Elements
import theme from '../../../theme/style'
import ScreenLoader from '../../component/ScreenLoader';
import useJwt from '../../../util/util';
import ThemeButton from '../../../theme/buttons';
import Toast from 'react-native-root-toast';
import ThemeInput from '../../../theme/form/Input';


const minHeight = Platform.OS == "ios" ? (Dimensions.get('window').height - 30) : (Dimensions.get('window').height);
const screenHeight = Dimensions.get('screen').height;

function JobCreateTimeAndFare(props) {
    const formMethods = useForm();
    let formErrors = formMethods.formState.errors;
    const [buttonRef,setButtonRef] = React.useState({});

    const [data, setData] = React.useState(props.appData.jobCategories);
    const [locations, setLocations] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [budgetValue, setBudgetValue] = React.useState(0.00);
    const handleShowModal =()=>{
        setShowModal(true)
    }
    const handleHideModal = () => {
        setShowModal(false)
    }
    /// To confirm the time and budget
    /// Then go to next screen
    const onSubmit = async data => {
        await props.setJobRequestFormData({...props.jobRequestFormData, ...data})
        props.navigation.navigate('JobSummary')
    };
    /// To confirm the location chosen by user
    /// Then go to next screen
    const handleConfirmLocations =  async () =>{
        let locationsLength = Object.keys(locations).length
        let havePickup = false
        await Object.values(locations).filter((item, index) => {
            if (item.location_type == 1) {
                havePickup = true
            }
        })
        let haveDelivery = false
        await Object.values(locations).filter((item, index) => {
            if (item.location_type == 2) {
                haveDelivery = true
            }
        })

        if(havePickup){
            if (haveDelivery){

            }
            else{
                Toast.show('Please select minimum 1 drop off.', {
                    position: Toast.positions.CENTER,
                    animation: true,
                    hideOnPress: true,
                })
            }
        }else{
            Toast.show('Please select minimum 1 pick up.', {
                position: Toast.positions.CENTER,
                animation: true,
                hideOnPress: true,
            })
        }
    }

    React.useEffect(() => {
        setLoaded(true);
        const Run = async () => {
            useJwt.setToken(props.user.token);
            await useJwt.get("Common/categories").then(async (res) => {
                if (res.data) {
                    setData(res.data.data.categories);
                    props.setJobCategories(res.data.data.categories);
                    setLoaded(true);
                }
            }).catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    //notifyError('Error!', '', data.message)
                } else if (error.request) {
                    // The request was made but no response was received
                    // console.log(error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    //console.log('Error', error.message)
                }
            })
        }
        //Run();
    }, [showModal])
    if (loaded) {

        return (

            <SafeAreaView  id='Main-page' style={{ ...theme.main_screen, height: 'auto', minHeight: minHeight}} >
                <View style={{ ...theme.px_0, ...theme.mt_20, ...theme.row }}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                        style={{
                            ...theme.py_10,
                            ...theme.px_10,
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start'
                        }}>
                        <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
                    </TouchableOpacity>
                    <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.align_center,width:'80%'}}>
                        <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Time & Fare</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 20, paddingBottom: 30, marginTop: 20, maxHeight: minHeight-170}}>
                    <View style={{ ...theme.py_15 }}>
                        <FormProvider {...formMethods}>
                            <ThemeInput
                                MainContainerStyle={{ marginTop: 25 }}
                                InputConatainerStyle={{ width: '80%' }}
                                IconRight={<Text style={{...theme.gray}}>Mins</Text>}
                                TextInput={{
                                    placeholder: '20',
                                    keyboardType:'numeric'
                                }}
                                IconStyle={{ ...theme.black }}
                                Label="Estimate Time"
                                name='estimate_time'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.estimate_time}
                            />

                            <ThemeInput
                                MainContainerStyle={{ marginTop: 20 }}
                                InputConatainerStyle={{ width: '80%' }}
                                IconRight={<Text style={{ ...theme.black }}>+2</Text>}
                                TextInput={{
                                    placeholder: '0',
                                    keyboardType: 'numeric',
                                    onEndEditing:(e)=>{
                                        setBudgetValue(formMethods.getValues('budget'))
                                    }
                                }}
                                IconStyle={{ ...theme.black }}
                                Label="Budget (CAD)"
                                name='budget'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.budget}
                            />
                        </FormProvider>

                        <View style={{marginTop:50,...theme.jc_center }}>
                            <Text style={{ alignSelf: 'center', ...theme.f_34 ,...theme.heading_font, }}>
                                {budgetValue ? parseFloat(parseFloat(budgetValue) + 2).toFixed(2) : '0.00'}
                                <Text style={{ alignSelf: 'center', ...theme.f_18, ...theme.text_font, }}> (CAD)</Text>
                             </Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, zIndex: 1000, ...theme.w_100, ...theme.px_20, flexDirection: 'row', justifyContent: 'center' }}>
                    <ThemeButton
                        onPressAction={formMethods.handleSubmit(onSubmit)}
                        style={{ width: '40%', }}
                        height={40}
                        textStyle={{ fontSize: 18, fontWeight: '500' }}>
                            Next
                    </ThemeButton>
                </View>

            </SafeAreaView >
        )
    }
    else {
        return <ScreenLoader />
    }
}




const styles  = StyleSheet.create({

})


const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setDeviceId: (data) => dispatch({ type: 'SET_DEVICE_ID', payload: data }),
        setJobCategories: (data) => dispatch({ type: 'SET_JOB_CATEGORIES', payload: data }),
        setJobRequestFormData: (data) => dispatch({ type: 'SET_JOB_REQUEST_FORM_DATA', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user, appData, jobRequestFormData} = state
    return { user: user, userData: user.userDetails, appData: appData, jobRequestFormData: jobRequestFormData.jobRequestFormData }
}
export default connect(mapStateToProps, mapDispatchToProps)(JobCreateTimeAndFare)