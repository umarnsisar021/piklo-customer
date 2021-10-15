
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform, SafeAreaView, FlatList } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";

// Theme Elements
import theme from '../../theme/style'
import ScreenLoader from '../component/ScreenLoader';
import useJwt from '../../util/util';
import { connect } from 'react-redux';
import MapContainer from "./MapContainer";
import LocationsList from './LocationsList';
import { StatusBar } from 'expo-status-bar';
import { Icon } from 'react-native-elements';


 function OngoingJob(props) {

    const { task_id  } = props.route.params;

    const [data, setData] = React.useState(props.route.params.data);

    const [loaded, setLoaded] = React.useState(false);


    React.useEffect(()=>{

         useJwt.post("drivers/Jobs/job_view", { job_id: task_id }).then(async (res) => {
             props.setJobId(task_id)
            if (res.data.data) {

                await setData(res.data.data.job_detail);
                let pickups_locations = await Object.values(res.data.data.job_detail.pickups_locations).map((p,index)=>{
                    return { ...p, index: index }
                })
                let dropoff_locations = await Object.values(res.data.data.job_detail.dropoff_locations).map((d, index) => {
                    return { ...d , index: index}
                })

                let currentArray = [...pickups_locations, ...dropoff_locations]
                for(let i = 0; i < currentArray.length;i++){
                    if (currentArray[i]['status'] == 0 || currentArray[i]['status'] == 1){
                        props.setCurrentLocationId(currentArray[i]['id'])
                        break;
                    }
                }
                await props.setPickUps(pickups_locations)
                await props.setDropOffs(dropoff_locations)
                setTimeout(() => {
                    setLoaded(true)
                }, 2500);

            }
        })
    }, [])




    if(loaded){
        return (

            <View id='Main-page'  colors={['#FFFFFF', '#FFFFFF']} style={{ ...theme.main_screen,backgroundColor:'white' }} >
                <StatusBar backgroundColor="transparent" style="dark" />
                {/* Back Button */}
                <View
                    style={{
                        ...theme.py_10,
                        justifyContent: 'flex-start',
                        alignSelf: 'flex-start',
                        position: 'absolute',
                        top: 20,
                        zIndex: 1000,
                        flexDirection:'row',
                        backgroundColor:'white',
                        paddingLeft:20,
                        paddingRight:15,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                        style={{
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
                    </TouchableOpacity>
                    <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font}}>On Going Job</Text>
                </View>

                <MapContainer />
                <LocationsList  data={data}/>
                <View>
                    <Text></Text>
                </View>
            </View>
        )
    }
    else{
     return <ScreenLoader />
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setJobId: (data) => dispatch({ type: 'SET_ONGOING_JOB_ID', payload: data }),
        setPickUps: (data) => dispatch({ type: 'SET_PICKUPS', payload: data }),
        setDropOffs: (data) => dispatch({ type: 'SET_DROPOFFS', payload: data }),
        setCurrentLocationId: (data) => dispatch({ type: 'SET_LOCATION_ID', payload: data }),

    }
}

export default connect(null, mapDispatchToProps)(OngoingJob)