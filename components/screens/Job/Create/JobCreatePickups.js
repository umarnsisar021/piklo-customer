
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform, StyleSheet } from 'react-native';
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
const minHeight = Dimensions.get('window').height;
const screenHeight = Dimensions.get('screen').height;
function JobCreatePickups(props) {
    const formMethods = useForm();
    const [buttonRef,setButtonRef] = React.useState({});
    const onSubmit = data => console.log(data);
    const [data, setData] = React.useState(props.appData.jobCategories);
    const [pickups, setPickups] = React.useState({});
    const [loaded, setLoaded] = React.useState(false);

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

    }, [])
    if (loaded) {

        return (

            <View id='Main-page' style={{ ...theme.main_screen, height: 'auto', minHeight: minHeight}} >
                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 30, paddingBottom: 0, marginTop: 20 }}>
                    <StatusBar backgroundColor="transparent" />
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                        style={{
                            ...theme.py_10,
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start'
                        }}
                    >
                        <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
                    </TouchableOpacity>
                    <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Pickups {screenHeight}  x {minHeight}</Text>
                    <View>

                        {/* <Text style={{ ...theme.f_16 }}>Choose a category</Text> */}
                    </View>
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
            </View>
        )
    }
    else {
        return <ScreenLoader />
    }
}


const rows = 5;
const cols = 2;
const marginHorizontal = 4;
const marginVertical = 4;
const rect = (Dimensions.get('window').width / cols) - (marginHorizontal * (cols + 1))-30;
const stylesGrid = StyleSheet.create({
    scrollContainer: {

    },
    sectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent:'space-between'
    },
    boxContainer: {
        marginTop: 10,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        width: rect,
        height: rect,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius:15,
        borderWidth:1,
        borderColor:theme.purple.color,

    },
});

const PickUpComponent = ()=>{
    const [pickups, setPickups] = React.useState({});

    if (Object.values(pickups).length > 0) {
        return <></>
    }
    else{
        return <View>
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