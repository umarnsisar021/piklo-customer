import * as React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';

export function MapDirectionsComponents(props) {
    const [destination, setDestination] = React.useState({ longitude: 0.000, latitude: 0.000})

    const [loaded, setLoaded] = React.useState(false)
    const Run = async () => {
            let current_destination = [...props.onGoingJob.pickups, ...props.onGoingJob.dropoffs].find(data => data.id === props.onGoingJob.current_location_id)

            current_destination = {
                latitude: parseFloat(current_destination.latitude),
                longitude: parseFloat(current_destination.longitude)
            }

            setDestination(current_destination);
            //setOrigin(props.driver_current_location)
            //console.log(props.driver_current_location)
            setLoaded(true);

    }
    React.useEffect(() => {
        Run()
    }, [props.onGoingJob.current_location_id])

    if (loaded) {
        //console.log(origin)
        const origin = { latitude: props.driver_current_location.latitude, longitude: props.driver_current_location.longitude };
        console.log(origin)
        return <MapViewDirections  {...props} origin={origin} destination={destination} />;
    }
    else {
        return null
    }

}


const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions

    }
}
const mapStateToProps = (state) => {
    const {onGoingJob } = state
    return { onGoingJob: onGoingJob}
}
export default connect(mapStateToProps, mapDispatchToProps)(MapDirectionsComponents)
