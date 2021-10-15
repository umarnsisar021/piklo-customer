
import * as React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';
// Theme Elements
import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
import { connect } from 'react-redux';
function LocationsMarkerComponent(props) {
        const [coords,setCoords] = React.useState(null)
        const [loaded, setLoaded] = React.useState(false);
        React.useEffect(()=>{
            setCoords([...props.onGoingJob.pickups, ...props.onGoingJob.dropoffs])

        },[])

        React.useEffect(()=>{
            setLoaded(true)
        }, [coords])
        if (loaded){
            return Object.values(coords).map((p, index) => {
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

            })
        }
        else{
            return null
        }





}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}
const mapStateToProps = (state) => {
    const {  user, onGoingJob } = state
    return { user: user, userData: user.userDetails, onGoingJob: onGoingJob }
}
export default connect(mapStateToProps, mapDispatchToProps)(LocationsMarkerComponent)