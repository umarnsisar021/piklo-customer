
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Dimensions, Platform, StyleSheet, SafeAreaView, TouchableWithoutFeedback, FlatList, Image, } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
// Theme Elements
import theme from '../../../theme/style'
import ScreenLoader from '../../component/ScreenLoader';
import useJwt from '../../../util/util';
import ThemeButton from '../../../theme/buttons';
import Toast from 'react-native-root-toast';
import ThemeInput from '../../../theme/form/Input';

const minHeight = Platform.OS == "ios" ? (Dimensions.get('window').height - 30) : (Dimensions.get('window').height);
const screenHeight = Dimensions.get('screen').height;

function JobPaymentMethods(props) {
    const formMethods = useForm();
    let formErrors = formMethods.formState.errors;
    const [loaded, setLoaded] = React.useState(true);
    const [selectedMothod, setSelectedMothod] = React.useState(null);
    const [data, setData] = React.useState([
        {id:1,name:'Paypal',icon:'https://cdn-icons-png.flaticon.com/512/174/174861.png' },
        {id: 2, name: 'Stripe', icon:'https://cdn-icons-png.flaticon.com/512/5968/5968382.png' },
        { id: 3, name: 'Cash on Pickup', icon:'https://cdn-icons-png.flaticon.com/512/2037/2037426.png' },
        { id: 4, name: 'Cash on Delivery', icon:'https://cdn-icons-png.flaticon.com/512/1554/1554401.png' },
    ]);


    /// To confirm the time and budget
    /// Then go to next screen
    const onSubmit = async data => {
        await props.setJobRequestFormData({...props.jobRequestFormData, ...data})
        props.navigation.navigate('')
    };
    /// To render Methods
    const renderItem = ({ item, index, }) => {
        return <TouchableOpacity onPress={()=>{
            setSelectedMothod(item.id)
        }}>
            <View style={{ ...theme.row, ...theme.jc_space_between, borderColor:"#c9c9c9",borderWidth:1,borderRadius:10, height:60,...theme.my_5,...theme.bg_white,...theme.py_10,...theme.px_15,alignItems:'center'}}>
                        <View>
                           <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={{ uri: item.icon}} style={{width:30,height:30,resizeMode:'contain'}} />
                                <Text style={{ ...theme.ml_15, ...theme.f_16}}>{item.name}</Text>
                           </View>
                        </View>
                        <View>
                            <RadioButton
                                value={item.id}
                                status={selectedMothod === item.id ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedMothod(item.id)}
                                color={theme.purple.color}
                            />
                        </View>
                    </View>
        </TouchableOpacity>
    }


    React.useEffect(() => {
        console.log(props.jobRequestFormData.locations)
    }, [])
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
                        <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Select Method</Text>
                    </View>
                </View>


                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 20, paddingBottom: 30, marginTop: 20, maxHeight: minHeight-170}}>

                    <View style={{ ...theme.py_15 }}>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                        />
                    </View>

                </ScrollView>

                <View style={{ position: 'absolute', bottom: 0, zIndex: 1000, ...theme.w_100, ...theme.px_20, flexDirection: 'row', justifyContent: 'center' }}>
                    <ThemeButton
                        //onPressAction={formMethods.handleSubmit(onSubmit)}
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
        width: '50%', flex: 1, borderColor: '#c9c9c9', paddingVertical:5
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
export default connect(mapStateToProps, mapDispatchToProps)(JobPaymentMethods)