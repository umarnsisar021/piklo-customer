import * as React from 'react';
import { Animated, TouchableOpacity, View, Image, Dimensions, Platform } from 'react-native';

import MapView, { MarkerAnimated, Marker, PROVIDER_GOOGLE, ProviderPropType} from 'react-native-maps';
// Theme Elements
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
import DriverPin from '../../../assets/app/driver-car-pin.png'
import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
const GOOGLE_API_KEY = 'AIzaSyC7nnNdmQERibFC_DUCh926hQYrI9Q_BwA';
import MapDirectionsComponents from "./MapDirectionsComponents";
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import firebase from 'firebase';
import theme from "../../theme/style";

const AnimatedImage = Animated.createAnimatedComponent(Image)

class MapContainer extends React.Component{

    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.setDriveMode = this.setDriveMode.bind(this);
        this.markerRef = React.createRef();
        this.state = {
            region: {
                "latitude": 24.8570901,
                "latitudeDelta": LATITUDE_DELTA,
                "longitude": 67.060181,
                "longitudeDelta": LONGITUDE_DELTA
            },
            driver_current_location: new MapView.AnimatedRegion({
                "latitude": 24.8570901,
                "latitudeDelta": LATITUDE_DELTA,
                "longitude": 67.060181,
                "longitudeDelta": LONGITUDE_DELTA
            }),
            heading:0,
            error: '',
            coords:[...props.onGoingJob.pickups, ...props.onGoingJob.dropoffs],
            routes: null,
            cameraHeading:0,
            zoom: 15,
            pitch: 15,
            isDriveMode : false,
            d_loc : {
                "latitude": 24.8570901,
                "longitude": 67.060181,
            }

        };


    }

    _getDriverLocation = ()=>{

        firebase.database().ref('drivers/' + this.props.data.driver_id).on('value', (snapshot) => {
            const d_location = snapshot.val();
            const { driver_current_location } = this.state;
            const newCoordinate = {
                latitude: d_location.location.latitude,
                longitude: d_location.location.longitude,
                useNativeDriver:false,
            };
            driver_current_location.timing(newCoordinate).start()
            this.setState({ heading: d_location.location.heading})
            this.setState({ d_loc: {
                latitude: d_location.location.latitude,
                longitude: d_location.location.longitude
            }})
            this.updateCameraHeading()
            if (this.mapRef.current) {
                this.mapRef.current.animateCamera({
                    center: {
                        latitude: parseFloat(d_location.location.latitude),
                        longitude: parseFloat(d_location.location.longitude),
                    },
                    pitch: this.state.pitch,
                    zoom: this.state.zoom,

                });
            }
        })
    }

    updateCameraHeading = () => {

        if (this.mapRef.current) {

            this.mapRef.current.getCamera().then((info) => {

                this.setState({ cameraHeading: info.heading });
            });
        }
    }
    componentDidMount() {
        this._getDriverLocation();

    }

    getColor = (id) => {
        if (this.props.onGoingJob.current_location_id == id) {
            return '#111111';
        }
        else {
            return '#a8a8a8'
        }
    }
    unSetDriveMode =  async () =>{
        await this.setState({
            zoom: 13,
            pitch: 10
        })
        this.setState({
            isDriveMode: false
        })
    }
    setDriveMode = async ()=>{

        await this.setState({
                zoom:19,
                pitch:60
            })
        this.setState({
            isDriveMode : true
        })
    }


    render() {

        return (
        <View style={{ flex: 1 }}>
                <View
                    style={{ position:'absolute' ,bottom: 0,zIndex:1000,right:0 }}>
                    <TouchableOpacity onPress={()=>{
                        if(this.state.isDriveMode){
                            this.unSetDriveMode()
                        }
                        else{
                            this.setDriveMode()
                        }
                       }}>
                        <Icon
                            reverse
                            name='road'
                            type='font-awesome-5'
                            color={this.state.isDriveMode ? theme.purple.color : 'white'}
                            size={18}
                        />
                    </TouchableOpacity>
                    <View >
                        <TouchableOpacity onPress={()=>{
                            if(this.state.zoom < 20){
                                this.setState({zoom: this.state.zoom + 1})
                            }
                        }} >
                            <Icon
                                reverse
                                name='plus'
                                type='font-awesome-5'
                                color={this.state.isDriveMode ? theme.purple.color : 'white'}
                                size={18}

                            />
                        </TouchableOpacity>
                         <TouchableOpacity onPress={()=>{
                            if (this.state.zoom > 2 ) {
                                this.setState({ zoom: this.state.zoom - 1 })
                            }
                        }} >
                            <Icon
                                reverse
                                name='minus'
                                type='font-awesome-5'
                                color={this.state.isDriveMode ? theme.purple.color : 'white'}
                                size={18}
                            />
                        </TouchableOpacity>
                    </View>

                </View>
            <MapView style={{ flex: 1 }}
                ref={this.mapRef}
                pitchEnabled={true}
                zoomTapEnabled={true}
                zoomEnabled={true}
                zoomControlEnabled={true}
                provider={PROVIDER_GOOGLE}
                maxZoomLevel={20}
                minZoomLevel={5}
                showsCompass={true}
                // scrollEnabled={false}
                onLayout={() => {

                }}

                onRegionChangeComplete={Region =>{

                    let region = {
                        latitude: this.state.region.latitude,
                        longitude: this.state.region.longitude,
                        latitudeDelta: Region.latitudeDelta,
                        longitudeDelta: Region.longitudeDelta
                    };
                    this.setState({ region: region})
                    this.updateCameraHeading();


                }}
                initialRegion={this.state.region}>

                {/* DRIVER COMPONENT */}
                 <MarkerAnimated
                    ref={marker => {
                        this.markerRef = marker;
                    }}
                    coordinate={this.state.driver_current_location}
                    //rotation={parseFloat(this.state.heading - this.state.cameraHeading)}
                    rotation={this.state.heading - this.state.cameraHeading}
                    flat={false}

                >

                    <Image source={DriverPin} style={{ width: 30, height: 30, resizeMode: "contain",}} resizeMode="contain" />
                </MarkerAnimated>

                {/* LOCATIONS MARKER COMPONENT */}
                {Object.values(this.state.coords).map((p, index) => {
                    if (p.location_type == 1) {
                        return <Marker key={index}
                        coordinate={{ latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) }}

                        >
                        <Image source={pickupPin} style={{ width: 30, height: 50 }} resizeMode="contain" />
                        </Marker>
                    }
                    if (p.location_type == 2) {
                        return <Marker key={index}
                        coordinate={{ latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) }}

                        >
                        <Image source={dropoffPin} style={{ width: 30, height: 50 }} resizeMode="contain" />
                        </Marker>
                    }

                })}

                {/* DIRECTIONS */}

                    <MapDirectionsComponents

                        apikey={GOOGLE_API_KEY} // insert your API Key here
                        strokeWidth={4}
                        mode="DRIVING"
                        strokeColor="#111111"
                        resetOnChange={false}
                        precision={"low"}
                        timePrecision={"now"}
                        driver_current_location={this.state.d_loc}
                        current_location_id={this.props.onGoingJob.current_location_id}
                    />

                </MapView>
            </View>
        )}

    }


MapContainer.propTypes = { provider: ProviderPropType, };

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setDeviceId: (data) => dispatch({ type: 'SET_DEVICE_ID', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user, onGoingJob } = state
    return { user: user, userData: user.userDetails, onGoingJob: onGoingJob}
}
export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
