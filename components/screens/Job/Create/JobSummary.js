
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
import Toast from 'react-native-root-toast';
import ThemeInput from '../../../theme/form/Input';

const minHeight = Platform.OS == "ios" ? (Dimensions.get('window').height - 30) : (Dimensions.get('window').height);
const screenHeight = Dimensions.get('screen').height;

function JobSummary(props) {
    const formMethods = useForm();
    let formErrors = formMethods.formState.errors;
    const [loaded, setLoaded] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);

    /// To confirm Summary
    /// Then go to next screen
    const onSubmit = async data => {
        props.navigation.navigate('JobPaymentMethods')
    };
    /// To render FlexBox
    const JobDetailsComponent = ()=>{
        return  <View>
                    <View style={{ ...styles.summaryFlexBox}}>
                        <View style={{ ...styles.summaryFlexBoxItem}}>
                            <Text style={{ ...styles.summaryFlexBoxItemHeading }}>Category</Text>
                            <Text>{props.jobRequestFormData.category_name}</Text>
                        </View>
                        <View style={{ ...styles.summaryFlexBoxItem, borderLeftWidth: 1, ...styles.summaryFlexBoxPadding}}>
                            <Text style={{ ...styles.summaryFlexBoxItemHeading }}>Type</Text>
                            <Text>Intracity</Text>
                        </View>
                    </View>
                    <View style={{ ...styles.summaryFlexBox }}>
                            <View style={{ ...styles.summaryFlexBoxItem, borderTopWidth: 1, borderBottomWidth: 1}}>
                                <Text style={{ ...styles.summaryFlexBoxItemHeading }}>Estimated Time</Text>
                                <Text>{props.jobRequestFormData.estimate_time} min</Text>
                            </View>
                            <View style={{ ...styles.summaryFlexBoxItem, borderLeftWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, ...styles.summaryFlexBoxPadding }}>
                                <Text style={{ ...styles.summaryFlexBoxItemHeading }}>Budget (CAD)</Text>
                                <Text>{props.jobRequestFormData.budget}-{parseFloat(props.jobRequestFormData.budget)+2}</Text>
                            </View>
                    </View>
                </View>
    }

    const JobLocationsComponent = () => {
        const locations = props.jobRequestFormData.locations
        return <View style={{marginTop:10}}>
                <View>
                    <Text style={{...theme.f_20,...theme.my_10,...theme.heading_font}}>Pickup</Text>
                </View>
             {
                Object.values(locations).map((item,key)=>
                 {
                    if (item.location_type == 1 ){
                        return <TouchableWithoutFeedback key={key} style={{...theme.my_20}} >
                                    <View style={{ paddingLeft: 0, marginVertical: 3  }}>
                                        <View style={styles.locationItemRow}>

                                            <View style={{
                                                ...styles.ItemDetailContainer,
                                            }}>
                                                <View>

                                                    <Text style={{ ...styles.itemAddress }}>{item.address}</Text>
                                                </View>
                                                <View>
                                                    {
                                                        item.note != "" ? <Text style={{ ...styles.itemNote }}>Notes: {item.note}</Text> : <></>
                                                    }
                                                </View>

                                                <View style={{ ...theme.row, ...theme.jc_space_between }}>
                                                    <View></View>
                                                    <View></View>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                     }
                     else{
                         return null
                     }
                 })
             }


            <View>
                <Text style={{ ...theme.f_20, ...theme.my_10, ...theme.heading_font }}>Drop off</Text>
            </View>

            {
                Object.values(locations).map((item, key) => {
                    if (item.location_type == 2) {
                        return <TouchableWithoutFeedback key={key} style={{  }} >
                            <View style={{ paddingLeft: 0, marginVertical:3 }}>
                                <View style={styles.locationItemRow}>

                                    <View style={{
                                        ...styles.ItemDetailContainer,
                                    }}>
                                        <View>

                                            <Text style={{ ...styles.itemAddress }}>{item.address}</Text>
                                        </View>
                                        <View>
                                            {
                                                item.note != "" ? <Text style={{ ...styles.itemNote }}>Notes: {item.note}</Text> : <></>
                                            }
                                        </View>

                                        <View style={{ ...theme.row, ...theme.jc_space_between }}>
                                            <View></View>
                                            <View></View>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    else {
                        return null
                    }
                })
            }
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
                        <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Summary</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 20, paddingBottom: 30, marginTop: 20, maxHeight: minHeight-170}}>
                    <View style={{ ...theme.py_15 }}>
                        <JobDetailsComponent />
                        <JobLocationsComponent />
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
export default connect(mapStateToProps, mapDispatchToProps)(JobSummary)