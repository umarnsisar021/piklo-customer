
import * as React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';
// Theme Elements
import DriverPin from '../../../assets/app/driver-car-pin.png'
import { connect } from 'react-redux';
function DriverMarkerComponent(props) {


        return (
            <Marker
                coordinate={{ latitude: parseFloat(props.location.latitude), longitude: parseFloat(props.location.longitude) }}
                // rotation={parseFloat(props.heading)}
            flat={false}
            title='Your Driver'
            description='Arriving in 2 mins'
        >
                <Image source={DriverPin} style={{width:30,height:30 ,resizeMode:"contain"}} resizeMode="contain" />
        </Marker>

        )

}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}
const mapStateToProps = (state) => {
    const { location ,heading } = state.user
    return { location: location, heading: heading}
}
export default connect(mapStateToProps, mapDispatchToProps)(DriverMarkerComponent)