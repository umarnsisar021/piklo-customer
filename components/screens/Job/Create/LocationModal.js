
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Modal, Dimensions, Platform, StyleSheet, Image } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import { RadioButton } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { TextInput } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Icon } from 'react-native-elements';
// Theme Elements
import theme from '../../../theme/style'
import notification from '../../../../assets/app/notification.png'
import ScreenLoader from '../../component/ScreenLoader';
import useJwt from '../../../util/util';
import ThemeButton from '../../../theme/buttons';
import Global from '../../../util/global';
import pickupIcon from '../../../../assets/app/pickup.png'
import dropoffIcon from '../../../../assets/app/dropoff.png'


// Dimensions
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const LocationModal = (props) => {
    const formData = useForm({
        defaultValues: {
            address: "",
            longitude: "",
            latitude: "",
            location_type: "1",
            note: "",

        }
    });
    const [locationType, setLocationType] = React.useState(1)
    const [locationTypeButton, setLocationTypeButton] = React.useState({
        pick: 'checked',
        drop: 'unchecked',
    });
    const [dropDisable, setDropDisable] = React.useState(false);
    const [position, setPosition] = React.useState(null);

    const mapRef = React.useRef();
    const _getLocationAsync = async () => {
        //let { status } = await Location.requestBackgroundPermissionsAsync();
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High});
        await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + location.coords.latitude + ',' + location.coords.longitude + '&key=' + Global.GOOGLE_API_KEY)
            .then((response) => response.json())
            .then((responseJson) => {
                formData.setValue("address", responseJson.results[0].formatted_address)
        })
        formData.setValue("latitude", location.coords.latitude)
        formData.setValue("longitude", location.coords.longitude)
        setPosition(location.coords);
    };

    const handleSelectLocationType = (type)=>{
        if(type == 'pick'){
            setLocationTypeButton({
                drop: 'unchecked',
                pick: 'checked'
            })
            setLocationType(1)
            formData.setValue("location_type", 1)
        }
        else{
            setLocationTypeButton({
                drop: 'checked',
                pick: 'unchecked'
            })
            setLocationType(2)
            formData.setValue("location_type", 2)
        }
    }

    const handleSelectPosition =async (loc) => {
        setPosition(loc);
        await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + loc.latitude + ',' + loc.longitude + '&key=' + Global.GOOGLE_API_KEY)
            .then((response) => response.json())
            .then((responseJson) => {
                formData.setValue("address", responseJson.results[0].formatted_address)
            })

        formData.setValue("latitude", loc.latitude)
        formData.setValue("longitude", loc.longitude)

        mapRef.current.animateToRegion({
            ...loc,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },1500)
    }

    // Check the selected locations have pickups ,
    // If don`t then disable the dropoff radio
    const _havePickup = async () =>{

        if(Object.keys(props.locations).length>0){
            let havePickup = false;
            await Object.values(props.locations).map((row)=>{
               if (row.location_type == 1){
                    havePickup = true;
               }
            })
            if (havePickup){
                // if selected locations have  have pickups
                setDropDisable(false)

            }
            else{
                // if selected locations have doesn`t have pickups
                setDropDisable(true)
            }
        }else{
            setDropDisable(true)
        }
    }
    React.useEffect(()=>{
        _getLocationAsync();
        _havePickup()
    },[dropDisable])

    if (position){
        return  <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={props.show}
                    onRequestClose={() => {
                        // Alert.alert('Modal has now been closed.');
                    }}>
                    <TouchableOpacity
                        onPress={()=>{
                            props.onClose()
                        }}
                        style={{position: 'absolute',right:0,zIndex:100,top: 0,}}
                    >
                        <Icon reverse size={15} color={theme.purple.color} type="ionicon" name="close-outline" />
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',...theme.mx_15,backgroundColor:'transparent'}}>
                        <GooglePlacesAutocomplete
                            disableScroll={true}
                            fetchDetails={true}
                            styles={AutoSearchCompleteStyle}
                            GooglePlacesDetailsQuery={{ fields: 'geometry', }}
                            placeholder='Search'
                            onPress={(data, details = null) => {
                                let loc =details.geometry.location;
                                formData.setValue("address", data.description)
                                handleSelectPosition({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                })

                            }}
                            query={{
                                key: Global.GOOGLE_API_KEY,
                                language: 'en',
                            }}
                        />
                    </View>
                    <MapView style={{ flex: 1 }}
                        ref={mapRef}
                        pitchEnabled={true}
                        zoomTapEnabled={true}
                        zoomEnabled={true}
                        zoomControlEnabled={true}
                        provider={PROVIDER_GOOGLE}
                        maxZoomLevel={20}
                        minZoomLevel={5}
                        showsCompass={true}

                        onRegionChangeComplete={Region => {


                        }}
                        initialRegion={{
                            latitude: position.latitude,
                            longitude: position.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}>
                        <Marker coordinate={position} draggable onDragEnd={(e)=>{

                            handleSelectPosition(e.nativeEvent.coordinate)
                        }}>
                            <Image source={locationType == 1 ? pickupIcon : dropoffIcon } style={{width:30,height:40, resizeMode:'contain'}}/>
                        </Marker>



                    </MapView>
                    <View style={{...theme.py_15 , ...theme.px_25}}>
                    <View style={{ ...theme.row, ...theme.align_center }}>
                            <View style={{...theme.row,...theme.align_center,...theme.pr_20}}>
                                <RadioButton
                                    value="pickup"
                                    status={locationTypeButton.pick}
                                    color={theme.purple.color}
                                    onPress={() => { handleSelectLocationType('pick')}}
                                />
                                <Text>Pickup</Text>
                            </View>
                            <View style={{ ...theme.row, ...theme.align_center, ...theme.pl_20}}>
                                <RadioButton
                                    value="dropoff"
                                    status={locationTypeButton.drop}
                                    color={theme.purple.color}
                                    disabled={dropDisable}
                                    onPress={() => { handleSelectLocationType('drop') }}
                                />
                                <Text>Drop off</Text>
                            </View>
                        </View>
                        <View>
                            <Text>Notes</Text>
                            <View style={styles.textAreaContainer} >
                                <TextInput
                                    style={styles.textArea}
                                    underlineColorAndroid="transparent"
                                    placeholder="Type something"
                                    placeholderTextColor="grey"
                                    numberOfLines={10}
                                    multiline={true}
                                    {...formData.register("note")}
                                    onChangeText={(text)=>{
                                        formData.setValue("note",text)
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{...theme.row,...theme.align_center,...theme.jc_center}}>
                            <ThemeButton
                                onPressAction={formData.handleSubmit(props.onSubmit)}
                                style={{ width: '40%', }} height={40} textStyle={{ fontSize: 18, fontWeight: '500' }}>
                                    Save
                            </ThemeButton>
                        </View>
                    </View>
                </Modal>
    }
    else{
        return <></>
    }
}

const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: theme.purple.color,
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        ...theme.my_15
    },
    textArea: {
        height: 60,
        justifyContent: "flex-start",
        textAlignVertical: 'top'
    }
})

const AutoSearchCompleteStyle = {
    container: {
        backgroundColor: 'transparent',
    },
    textInputContainer: {
        flexDirection: 'row',
        width: '85%'
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        height: 44,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 15,
        flex: 1,
    },
    poweredContainer: {
        display: 'none'
    },
    powered: {},
    listView: {
        backgroundColor: 'transparent',
    },
    row: {
        backgroundColor: 'white',
        padding: 13,
        height: 44,
        flexDirection: 'row',
        marginVertical: 5,
        borderColor: theme.purple.color,
        borderWidth:1,
        borderRadius:10

    },
    separator: {
        height: 0,
        backgroundColor: 'pink',
    },
    description: {},
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
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
export default connect(mapStateToProps, mapDispatchToProps)(LocationModal)