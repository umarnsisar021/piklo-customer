import * as React from 'react';
import { Animated, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform } from 'react-native';

import MapView, { Camera, Marker, Polyline, PROVIDER_GOOGLE, ProviderPropType, AnimatedRegion} from 'react-native-maps';
// Theme Elements
import MapViewDirections from 'react-native-maps-directions';
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
import DriverPin from '../../../assets/app/driver-car-pin.png'
import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
const GOOGLE_API_KEY = 'AIzaSyC7nnNdmQERibFC_DUCh926hQYrI9Q_BwA';
import Svg, { parse, Path } from "react-native-svg";
import * as Location from "expo-location";
import { connect } from 'react-redux';
import MapDirectionsComponents from './MapDirectionsComponents';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import firebase from 'firebase';


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

        };
    }

    _getDriverLocation = ()=>{
        firebase.database().ref('drivers/' + this.props.data.driver_id).on('value', (snapshot) => {
            const d_location = snapshot.val();
            this.state.driver_current_location.timing({
                ...d_location,
                latitude: parseFloat(d_location.location.latitude),
                longitude: parseFloat(d_location.location.longitude),

                useNativeDriver: true,
            }).start()
            this.setState({ heading: d_location.location.heading})
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

    setDriveMode = ()=>{
     this.setState({
            zoom:19,
            pitch:60
        })
    }



    render() {
        return (
        <View style={{ flex: 1 }}>
                <View
                    style={{ position:'absolute' ,bottom: 0,zIndex:1000,right:0 }}>
                    <TouchableOpacity onPress={this.setDriveMode}>
                        <Icon
                            reverse
                            name='road'
                            type='font-awesome-5'
                            color='white'
                            size={18}
                        />
                    </TouchableOpacity>
                </View>
            <MapView.Animated style={{ flex: 1 }}
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

                    //const zoomLevel = Math.log2(360 * ((width / 256) / Region.longitudeDelta)) + 1

                   // this.setState({ zoom: zoomLevel })
                    let region = {
                        latitude: this.state.region.latitude,
                        longitude: this.state.region.longitude,
                        latitudeDelta: Region.latitudeDelta,
                        longitudeDelta: Region.longitudeDelta
                    };
                    this.setState({ region: region})
                    this.updateCameraHeading();


                }}
                initialRegion={this.state.driver_current_location}>

                {/* DRIVER COMPONENT */}
                <Marker.Animated
                    ref={this.markerRef}
                    coordinate={this.state.driver_current_location}
                    //rotation={parseFloat(this.state.heading - this.state.cameraHeading)}
                    rotation={this.state.heading - this.state.cameraHeading}
                    flat={false}
                    title='Your Driver'
                    description='Arriving in 2 mins'
                >

                    <Image source={DriverPin} style={{ width: 30, height: 30, resizeMode: "contain",}} resizeMode="contain" />
                </Marker.Animated>

                {/* LOCATIONS MARKER COMPONENT */}
                {Object.values(this.state.coords).map((p, index) => {
                    if (p.location_type == 1) {
                        return <Marker key={index}
                        coordinate={{ latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) }}
                        title='Your Driver'
                        description='Arriving in 2 mins'
                        >
                        <Image source={pickupPin} style={{ width: 30, height: 50 }} resizeMode="contain" />
                        </Marker>
                    }
                    if (p.location_type == 2) {
                        return <Marker key={index}
                        coordinate={{ latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) }}
                        title='Your Driver'
                        description='Arriving in 2 mins'
                        >
                        <Image source={dropoffPin} style={{ width: 30, height: 50 }} resizeMode="contain" />
                        </Marker>
                    }

                })}

                {/* DIRECTIONS */}


                <MapDirectionsComponents
                        origin={{
                            latitude: 24.761002905112,
                            longitude: 67.063211984932
                        }}
                        apikey={GOOGLE_API_KEY} // insert your API Key here
                        strokeWidth={4}
                        mode="DRIVING"
                        strokeColor="#111111"
                        resetOnChange={false}
                        precision={"low"}
                        timePrecision={"now"}
                        lineDashPattern={[null]}
                        current_location_id={this.props.onGoingJob.current_location_id}
                    />
                </MapView.Animated>
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
