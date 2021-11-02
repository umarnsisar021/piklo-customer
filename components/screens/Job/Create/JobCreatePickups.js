
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Animated, Dimensions, Platform, StyleSheet, Alert, FlatList, SafeAreaView, Image } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";

// Theme Elements
import theme from '../../../theme/style'
import ScreenLoader from '../../component/ScreenLoader';
import useJwt from '../../../util/util';
import ThemeButton from '../../../theme/buttons';
import LocationModal from './LocationModal';
import pickupIcon from '../../../../assets/app/pickup.png'
import dropoffIcon from '../../../../assets/app/dropoff.png'


const minHeight = Platform.OS == "ios" ? (Dimensions.get('window').height - 30) : (Dimensions.get('window').height);
const screenHeight = Dimensions.get('screen').height;

function JobCreatePickups(props) {
    const formMethods = useForm();
    const [buttonRef,setButtonRef] = React.useState({});
    const onSubmit = data => console.log(data);
    const [data, setData] = React.useState(props.appData.jobCategories);
    const [locations, setLocations] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const handleShowModal =()=>{
        setShowModal(true)
    }
    const handleHideModal = () => {
        setShowModal(false)
    }
    ///
    /// To store location in locations state
    /// Data return from location modal
    const handleAddLocation = (data) => {
        data['key'] = Object.keys(locations).length
        let a = locations;
        a.push(data);
        setLocations(a)
        handleHideModal(false)
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
                        <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Picks & Drops</Text>
                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { handleShowModal()}}>
                            <Icon type="ionicon" size={28} name="add-circle-outline" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 20, paddingBottom: 30, marginTop: 20, maxHeight: minHeight-170}}>
                    <StatusBar backgroundColor="transparent" />

                    <View style={{ ...theme.py_15 }}>
                        <LocationListComponent data={locations} setData={setLocations} />
                    </View>



                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, zIndex: 1000, ...theme.w_100, ...theme.px_20, flexDirection: 'row', justifyContent: 'center' }}>
                    <ThemeButton
                        onPressAction={() => {
                            //props.navigation.navigate('Login')
                        }}
                        style={{ width: '40%', }} height={40} textStyle={{ fontSize: 18, fontWeight: '500' }}>Next</ThemeButton>
                </View>
                <LocationModal show={showModal} onClose={handleHideModal} locations={locations} onSubmit={handleAddLocation} />
            </SafeAreaView >
        )
    }
    else {
        return <ScreenLoader />
    }
}



const LocationListComponent = (props)=>{
    const [selected, setSelected] = React.useState(null);
    let DataLength = Object.keys(props.data).length;
    let slideAnim  = [];
    Object.keys(props.data).map((v,key)=>{
      slideAnim[key] = React.createRef(new Animated.Value(50)).current;
    })
    const slideIn = (key) => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(slideAnim[key], {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true
        }).start();
    };

    const slideOut = (key) => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(slideAnim[key], {
            toValue: 30,
            duration: 3000,
            useNativeDriver: true
        }).start();
    };
    // List Item Connecting Line
    const ConnectBottomLine = ({index,length}) =>{
        if (index == (length-1)){
            return null
        }
        else{
           return <View style={{ position: 'absolute', width: 3, height: '50%', backgroundColor: theme.purple.color, zIndex: 100, top: '50%', left: -0 }}>
                    </View>
       }
    }

    const ConnectListItemComponent = ({ index, item }) => {
        return <View style={{...styles.C_L_I_C_MAIN, top: index === 0 ? '50%' : '0%',}}>
                    <View style={{...styles.C_L_I_C_H_LINE,top: index === 0 ? '0%' : '98%',}}>
                        <View style={{ ...styles.C_L_I_C_BULLET, }}>
                            {item.location_type == '1' ?
                                <Text style={{ ...styles.C_L_I_C_BULLET_TEXT }}>P</Text> :
                                <Text style={{ ...styles.C_L_I_C_BULLET_TEXT }}>D</Text>
                            }
                        </View>
                    </View>
                </View>
    }

    React.useEffect(()=>{

    }, [props.data]);
    // List Item Render Component
    const renderItem = ({ item, index, drag, isActive }) => {

        return <TouchableOpacity
                    onLongPress={drag}
                    onPress={() => {
                        setSelected(index);

                    }}
                    disabled={isActive}
                    style={{paddingLeft:20}}
                >
                    <ConnectListItemComponent index={index} item={item} />
                    <ConnectBottomLine index={index} length={DataLength} />
                    <View style={styles.locationItemRow}>

                        <View style={{
                                ...styles.ItemDetailContainer,
                                width: selected === index ? '95%' : '100%',
                            }}>
                            <View>

                                <Text style={{ ...styles.itemAddress }}>{item.address}</Text>
                            </View>
                            <View>
                                {
                                 item.note != "" ? <Text style={{ ...styles.itemNote }}>Notes: {item.note}</Text> : <></>
                                }
                            </View>

                            <View style={{...theme.row , ...theme.jc_space_between}}>
                                <View></View>
                                <View></View>
                            </View>
                        </View>
                        <Animated.View style={{ display: selected === index ? 'flex' : 'none',
                                    transform: [{
                                        translateX: slideAnim[index]
                                    }]
                        }}>
                                <Icon type="ionicon" name="close-circle-outline" />
                        </Animated.View>
                    </View>
                </TouchableOpacity>

        ;
    };
    if (Object.values(props.data).length > 0) {
        return <SafeAreaView>
                    <DraggableFlatList
                        scrollEnabled={false}
                        LisHeaderComponent={<></>}
                        ListFooterComponent={<></>}
                        data={props.data}
                        onDragEnd={({ data }) => props.setData(data)}
                        keyExtractor={(item) => item.key.toString()}
                        renderItem={renderItem}
                    />
        </SafeAreaView>
    }
    else{
        return <View style={{...theme.align_center,...theme.jc_space_between}}>
                <Text>No Pickups</Text>
            </View>
    }

}

const styles  = StyleSheet.create({
    locationItemRow : {
        backgroundColor: 'white',
        borderColor: 'lightgray',
        ...theme.row,
        ...theme.py_15,
        ...theme.px_15,
        borderWidth: 1,
        ...theme.br_10,
        ...theme.my_5
    },
    ItemTypeImage:{
        width: 20,
        height: 40,
        resizeMode:'contain',
        marginRight:10,
    },
    ItemDetailContainer: {
        flexGrow: 1,
        ...theme.pl_10,
        ...theme.pr_0
    },
    itemNote:{
        fontSize:13,
        ...theme.gray,
        fontWeight:'700'
    },
    itemAddress:{
        fontSize:13,
        ...theme.black,
    },
    C_L_I_C_MAIN:{
        position: 'absolute',
        width: 3,
        height: '50%',
        backgroundColor: theme.purple.color,
        zIndex: 100,
        left: -0
    },
    C_L_I_C_H_LINE:{
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
export default connect(mapStateToProps, mapDispatchToProps)(JobCreatePickups)