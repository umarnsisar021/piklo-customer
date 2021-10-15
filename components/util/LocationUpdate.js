import * as React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import useJwt from './util';


const LOCATION_TASK_NAME = "background-location-task";
function LocationUpdate(props){
        const [Update,setUpdate] =React.useState(true)


        const getLocation = async () => {




                // let { status } = await Location.requestBackgroundPermissionsAsync();
                // if (status !== 'granted') {
                //     setErrorMsg('Permission to access location was denied');
                //     return;
                // }

                let location = {};
                await Location.requestForegroundPermissionsAsync();
                const { status } = await Location.requestBackgroundPermissionsAsync();
                const a = await Location.requestBackgroundPermissionsAsync();

                    if (status === 'granted') {
                     location = await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                        accuracy: Location.Accuracy.BestForNavigation,
                        enableHighAccuracy: true,
                        distanceInterval: 1,
                        timeInterval: 30000,
                        activityType: Location.ActivityType.AutomotiveNavigation,
                    });
                }


                return location;

        }


        React.useEffect( ()=>{
            getLocation()
        }, [Update])



    return(
        <></>
      )




  }




  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        //console.log(error);
        return;
    }
    if (data) {
        const { locations } = data;
        let lat = locations[0].coords.latitude;
        let long = locations[0].coords.longitude;
        ///props.setLocation(locations[0].coords)

        useJwt.post("/Common/location_update",{
                ...locations[0].coords
        }).then((res)=>{
                //console.log(res.data.message)
        })

    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setLocation: (data) => dispatch({ type: 'SET_LOCATION', payload: data }),
        setHeading: (data) => dispatch({ type: 'SET_HEADING', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user } = state
    return { user: user }
}
export default connect(mapStateToProps, mapDispatchToProps)(LocationUpdate)