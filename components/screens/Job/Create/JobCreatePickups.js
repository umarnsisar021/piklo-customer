
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Modal, Dimensions, Platform, StyleSheet } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { connect } from 'react-redux';
import { Icon, CheckBox } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

// Theme Elements
import theme from '../../../theme/style'
import notification from '../../../../assets/app/notification.png'
import ScreenLoader from '../../component/ScreenLoader';
import useJwt from '../../../util/util';
import ThemeButton from '../../../theme/buttons';
import LocationModal from './LocationModal';

const minHeight = Platform.OS == "ios" ? (Dimensions.get('window').height - 30) : (Dimensions.get('window').height);
const screenHeight = Dimensions.get('screen').height;

function JobCreatePickups(props) {
    const formMethods = useForm();
    const [buttonRef,setButtonRef] = React.useState({});
    const onSubmit = data => console.log(data);
    const [data, setData] = React.useState(props.appData.jobCategories);
    const [pickups, setPickups] = React.useState({});
    const [loaded, setLoaded] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const handleShowModal =()=>{
        setShowModal(true)
    }
    const handleHideModal = () => {
        setShowModal(false)
    }

    React.useEffect(() => {
        props.setJobRequestFormData({});
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

        console.log(showModal)
    }, [showModal])
    if (loaded) {

        return (

            <View id='Main-page' style={{ ...theme.main_screen, height: 'auto', minHeight: minHeight}} >
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
                        <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Picks & Drops</Text>
                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { handleShowModal()}}>
                            <Icon type="ionicon" size={28} name="add-circle-outline" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 30, paddingBottom: 0, marginTop: 20 }}>
                    <StatusBar backgroundColor="transparent" />

                    <View style={{ ...theme.py_15 }}>
                        <PickUpComponent></PickUpComponent>
                    </View>
                </ScrollView>
                <View style={{ ...theme.py_20 , position:'relative' }}>
                    <View style={{ position: 'absolute', bottom: 0, zIndex: 1000, ...theme.w_100, ...theme.px_20,flexDirection:'row',justifyContent:'center'}}>
                        <ThemeButton
                            onPressAction={() => {
                                //props.navigation.navigate('Login')
                            }}
                            style={{ width: '40%', }} height={40} textStyle={{ fontSize: 18, fontWeight: '500' }}>Next</ThemeButton>
                    </View>
                </View>
                <LocationModal show={showModal} onClose={handleHideModal}  />
            </View>
        )
    }
    else {
        return <ScreenLoader />
    }
}




const PickUpComponent = ()=>{
    const [pickups, setPickups] = React.useState({});

    if (Object.values(pickups).length > 0) {
        return <></>
    }
    else{
        return <View style={{...theme.align_center,...theme.jc_space_between}}>
                <Text>No Pickups</Text>
            </View>
    }

}




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
export default connect(mapStateToProps, mapDispatchToProps)(JobCreatePickups)