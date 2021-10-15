import React, { Component } from "react";
import { StyleSheet, View, Dimensions ,Image} from "react-native";
import MapView, { Marker}from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";
import DriverPin from '../../../assets/app/driver-car-pin.png'
const LOCATION_TASK_NAME = "background-location-task";
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
export default class App extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.state = {
            region: {
                "latitude": 24.8570901,
                "latitudeDelta": LATITUDE_DELTA,
                "longitude": 67.060181,
                "longitudeDelta": LONGITUDE_DELTA
            },
            error: '',


        };

        // TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
        //     if (error) {
        //         console.log(error);
        //         return;
        //     }
        //     if (data) {
        //         const { locations } = data;
        //         let lat = locations[0].coords.latitude;
        //         let long = locations[0].coords.longitude;

        //         let region = {
        //                 ...locations[0].coords,
        //                 latitudeDelta: 0.045,
        //                 longitudeDelta: 0.045
        //         };
        //         this.setState({ region: region });
        //         console.log(region)
        //     }
        // })
    }

    _getLocationAsync = async () => {
        let { status } = await Location.requestBackgroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        //     accuracy: Location.Accuracy.BestForNavigation,
        //     enableHighAccuracy: true,
        //     distanceInterval: 1,
        //     timeInterval: 0,
        //     activityType: Location.ActivityType.AutomotiveNavigation,
        // });

        // let region = {
        //             latitude: this.location.coords.latitude,
        //             longitude: this.location.coords.longitude,
        //             latitudeDelta: 0.045,
        //             longitudeDelta: 0.045
        // };

        //this.setState({ region: region,});
        // watchPositionAsync Return Lat & Long on Position Change
            // this.location = await Location.watchPositionAsync(
            //     {
            //         accuracy: Location.Accuracy.BestForNavigation,
            //         activityType: Location.ActivityType.AutomotiveNavigation,
            //         enableHighAccuracy: true,
            //         distanceInterval: 1,
            //         timeInterval: 500
            //     },
            //     newLocation => {
            //         let { coords } = newLocation;
            //         // console.log(coords);
            //         let region = {
            //             latitude: coords.latitude,
            //             longitude: coords.longitude,
            //             latitudeDelta: 0.045,
            //             longitudeDelta: 0.045
            //         };
            //         //this.setState({ region: region });
            //         //console.log(region)
            //     },
            //     error => console.log(error)
            //  );

        Location.watchHeadingAsync((headObj)=>{
            let head = (headObj.trueHeading != -1) ? headObj.trueHeading : headObj.magHeading;
            // this.mapRef.current.animateCamera({
            //     center: {
            //         latitude: parseFloat(this.state.region.latitude),
            //         longitude: parseFloat(this.state.region.longitude),
            //     },
            //     heading: head,
            //     zoom: 18.7
            // }, { duration: 500 });
        })




        Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                activityType: Location.ActivityType.AutomotiveNavigation,
                enableHighAccuracy: true,
                distanceInterval: 1,
                timeInterval: 500

            },
            async(loc) => {
                let region = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                };
                this.setState({ region: region })

            }
        )

        return this.location;
    };

    async componentDidMount() {

            this._getLocationAsync();

    }



    render() {
        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={this.state.region}
                    showsCompass={true}

                    rotateEnabled={true}

                    style={{ flex: 1 }}
                >
                    <Marker
                        coordinate={{ latitude: parseFloat(this.state.region.latitude), longitude: parseFloat(this.state.region.longitude) }}
                        // rotation={parseFloat(props.heading)}
                        flat={false}
                        title='Your Driver'
                        description='Arriving in 2 mins'
                    >
                        <Image source={DriverPin} style={{ width: 30, height: 30, resizeMode: "contain" }} resizeMode="contain" />
                    </Marker>
                </MapView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});