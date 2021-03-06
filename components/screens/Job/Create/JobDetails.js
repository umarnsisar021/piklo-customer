
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Dimensions, Platform, StyleSheet, SafeAreaView, TouchableWithoutFeedback, } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
// Theme Elements
import theme from '../../../theme/style'
import ScreenLoader from '../../component/ScreenLoader';
import useJwt from '../../../util/util';
import ThemeButton from '../../../theme/buttons';
import firebase from 'firebase';




const minHeight = Platform.OS == "ios" ? (Dimensions.get('window').height - 30) : (Dimensions.get('window').height);
const screenHeight = Dimensions.get('screen').height;

function JobDetails(props) {
    const formMethods = useForm();
    let {id} = props.route.params
    //let id = 148
    let formErrors = formMethods.formState.errors;
    const [loaded, setLoaded] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [data, setData] = React.useState(false);
    /// To confirm Summary
    /// Then go to next screen
    const onSubmit = async data => {
        props.navigation.navigate('JobPaymentMethods')
    };

    const jobStatusCheck = (rec)=>{
        if(rec.current_status > 1){
            setTimeout(()=>{
                props.navigation.navigate('OngoingJob', { task_id: id, data: rec})
            },0)
        }
    }

    React.useEffect(()=>{
        firebase.database().ref('jobs/'+id).on('value', async(snapshot) => {
            const rec = snapshot.val();
            console.log(rec)
            await setData(rec)
            await jobStatusCheck(rec)
            setLoaded(true)
          })
    },[])

    const DetailsComponent = ()=>{
        return  <View>
                    <Text style={{alignSelf:'center',fontWeight:'bold',...theme.f_20}}>Job ID: #{data.id}</Text>
                    <View style={{width:'100%', height:200}}></View>
                    <View>
                        <Text style={{alignSelf:'center'}}>{data.current_job_status}</Text>
                    </View>
                </View>
    }

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
                        <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Job Detail</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 20, paddingBottom: 30, marginTop: 20, maxHeight: minHeight-170}}>
                    <View style={{ ...theme.py_15 }}>
                        <DetailsComponent />
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, zIndex: 1000, ...theme.w_100, ...theme.px_20, flexDirection: 'row', justifyContent: 'center' }}>
                    <ThemeButton
                        onPressAction={formMethods.handleSubmit(onSubmit)}
                        style={{ width: '40%', }}
                        height={40}
                        textStyle={{ fontSize: 18, fontWeight: '500' }}>
                            Pay Now
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
    summaryFlexBox:{
        flexDirection:'row',
        ...theme.jc_space_between,
    },

    summaryFlexBoxItem:{
        width: '50%', flex: 1, borderColor: '#c9c9c9', paddingVertical:5,paddingRight:5
    },
    summaryFlexBoxPadding: {
        paddingLeft:15
    },
    summaryFlexBoxItemHeading:{
        fontWeight: '700', ...theme.f_16
    },
    locationItemRow: {
        backgroundColor: 'white',
        borderColor: 'lightgray',
        ...theme.row,
        ...theme.py_15,
        ...theme.px_5,
        borderWidth: 1,
        ...theme.br_10,
    },
    ItemTypeImage: {
        width: 20,
        height: 40,
        resizeMode: 'contain',
        marginRight: 10,
    },
    ItemDetailContainer: {
        flexGrow: 1,
        ...theme.pl_10,
        ...theme.pr_0
    },
    itemNote: {
        fontSize: 13,
        ...theme.gray,
        fontWeight: '700'
    },
    itemAddress: {
        fontSize: 13,
        ...theme.black,
    },
    C_L_I_C_MAIN: {
        position: 'absolute',
        width: 3,
        height: '50%',
        backgroundColor: theme.purple.color,
        zIndex: 100,
        left: -0
    },
    C_L_I_C_H_LINE: {
        backgroundColor: theme.purple.color,
        width: 20,
        height: 3,
        borderRadius: 50
    },
    C_L_I_C_BULLET: {
        backgroundColor: 'white',
        width: 15,
        height: 15,
        top: -6.5,
        borderRadius: 50,
        left: 14,
        borderColor: theme.purple.color,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    C_L_I_C_BULLET_TEXT: {
        margin: 0,
        fontWeight: '700',
        fontSize: 10,
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(JobDetails)