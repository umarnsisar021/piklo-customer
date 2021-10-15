import * as React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';

export function MapDirectionsComponents(props) {
    const [destination, setDestination] = React.useState({ longitude: null, latitude: null})
    const [loaded, setLoaded] = React.useState(false)
    const Run = async () => {
        let current_destination = [...props.onGoingJob.pickups, ...props.onGoingJob.dropoffs].find(data => data.id === props.onGoingJob.current_location_id)
        current_destination = {
            latitude: parseFloat(current_destination.latitude),
            longitude: parseFloat(current_destination.longitude)
        }
        console.log('current_destination')
        console.log(current_destination)
        setDestination(current_destination);

        setLoaded(true);

    }
    React.useEffect(() => {

        Run()
    }, [props.onGoingJob.current_location_id])
    if (loaded) {

        return (
            <MapViewDirections  destination={destination} {...props} />
        );
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
