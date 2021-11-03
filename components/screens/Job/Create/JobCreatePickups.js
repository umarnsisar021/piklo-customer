
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Animated, Dimensions, Platform, StyleSheet, Alert, FlatList, SafeAreaView, Image, TouchableNativeFeedback, TouchableWithoutFeedbackBase, TouchableWithoutFeedback } from 'react-native';
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
import Toast from 'react-native-root-toast';


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
    /// To delete location from locations state
    /// Data return from LocationListComponent
    const handleRemoveLocation = async (key) => {
        let newIndex = 0 ;
        let indexOfItem = Object.values(locations).filter((item,index) => {
            if (item.key !== key){
                item.key = newIndex
                newIndex++
                return item
            }
        })
        setLocations(indexOfItem)
        handleHideModal(false)
    }
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
                props.navigation.navigate("JobCreateTimeAndFare");
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
                        <LocationListComponent
                            data={locations}
                            setData={setLocations}
                            removeItem={handleRemoveLocation}
                        />
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, zIndex: 1000, ...theme.w_100, ...theme.px_20, flexDirection: 'row', justifyContent: 'center' }}>
                    <ThemeButton
                        onPressAction={() => {
                           handleConfirmLocations()
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
    const [data, setData] = React.useState(props.data);
    let DataLength = Object.keys(props.data).length;
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const [slideAnimRef, setSlideAnimRef] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    const initAnim  = async()=>{
        let elRefs = [];
        await Object.keys(props.data).map((v,key)=>{
            elRefs[key] = React.createRef()
            elRefs[key].current = new Animated.Value(50);
        })
        await setSlideAnimRef(elRefs)
        setLoaded(true)
    }
    const slideIn = async (key) => {
        // Will change fadeAnim value to 1 in 0.5 seconds
        Animated.timing(slideAnimRef[key].current, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start();
    };

    const slideOut = async (key) => {
        // Will change fadeAnim value to 0 in 0.5 seconds
        Animated.timing(slideAnimRef[key].current, {
            toValue: 50,
            duration: 500,
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
        initAnim()
    }, [DataLength]);
    // List Item Render Component
    const renderItem = ({ item, index, drag, isActive }) => {
        return <TouchableWithoutFeedback
                    onLongPress={drag}
                    onPress={async () => {
                        if(selected !== index){
                            await slideOut(selected ? selected : 0)
                            await setSelected(index);
                            slideIn(index)
                        }
                    }}
                    disabled={isActive}

                >
                    <View style={{ paddingLeft: 20 }}>
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
                                            translateX: slideAnimRef[index] ? slideAnimRef[index].current : 50
                                        }]
                            }}>
                                <TouchableOpacity onPress={()=>{
                                    props.removeItem(item.key);
                                    setSelected(null)
                                }}>
                                    <Icon type="ionicon" name="close-circle-outline" />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
            </TouchableWithoutFeedback>

        ;
    };
    if (Object.values(props.data).length > 0 && loaded !== false) {

        return <SafeAreaView>
                    <DraggableFlatList
                        scrollEnabled={false}
                        LisHeaderComponent={<></>}
                        ListFooterComponent={<></>}
                        data={props.data}
                        onDragEnd={({ data }) => {
                            if (data[0].location_type !== 2){
                                props.setData(data)
                            }
                            else{
                                Toast.show("You can`t place drop off at first.",{
                                    position: Toast.positions.CENTER,
                                    animation: true,
                                    hideOnPress: true,
                                })
                            }
                        }}
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