
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform, SafeAreaView, FlatList } from 'react-native';


// Theme Elements
import theme from '../../theme/style'
import ScreenLoader from '../component/ScreenLoader';
import useJwt from '../../util/util';
import { connect } from 'react-redux';
import MapContainer from "./MapContainer";
import LocationsList from './LocationsList';
/// Icons
import checked from "../../../assets/app/checked.png";
import { LinearGradient } from 'expo-linear-gradient';
import ThemeButton from '../../theme/buttons';
import moment from 'moment';

import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
 function JobCompleted(props) {


    const { task_id } = props.route.params;
    const [loaded, setLoaded] = React.useState(false);
    const [data, setData] = React.useState(true);
    React.useEffect(()=>{

        const Run = async () => {

            await useJwt.post("drivers/Jobs/job_view", { job_id: task_id }).then(async (res) => {

                if (res.data.data) {
                    setData(res.data.data.job_detail);
                    setLoaded(true);
                }
            }).catch(function (error) {
                if (error.response) {
                    // Request made and server responded

                } else if (error.request) {
                    // The request was made but no response was received

                } else {
                    // Something happened in setting up the request that triggered an Error

                }
            })
        }
        Run();
    }, [])




    if(loaded){
        return (

            <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen }} >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100,marginTop:20}} style={{ ...theme.px_30,}}>

                    <View style={{...theme.jc_center,...theme.mt_20,}}>
                        <Image source={checked} style={{ width: 40, height: 40, resizeMode: "contain", alignSelf: 'center'}} />
                        <Text style={{ ...theme.f_28, ...theme.black, ...theme.heading_font, alignSelf: 'center' }}>Job ID #{task_id}</Text>
                    </View>

                    <View style={{...theme.mt_25}}>
                        <View style={{...theme.row,...theme.jc_space_between}}>
                            <Text><Text style={{ ...theme.f_w_bold, ...theme.black  }}> Start</Text> : {moment(data.starting_time).format("hh:mm a")}</Text>
                            <Text><Text style={{ ...theme.f_w_bold, ...theme.black  }}> End</Text > : {moment(data.starting_time).format("hh:mm a")}</Text>
                        </View>
                    </View>

                    <View style={{ ...theme.mt_10 }}>
                        <Text style={{...theme.heading_font,...theme.f_18,...theme.black,...theme.mt_10}}>Pickups</Text>
                        {
                            data.pickups_locations.map((row,key)=>{
                                return (
                                    <View key={key} style={{ backgroundColor: 'white', borderColor:'#e8e8e8',borderWidth:1, ...theme.p_15,borderRadius:10,...theme.mt_10}}>
                                        <View style={{ ...theme.row, backgroundColor: 'white'}}>
                                            <Image
                                                source={pickupPin}
                                                style={{ width: 18, height: 22, marginTop: 4, resizeMode: "contain" }}
                                            />
                                            <View style={{ ...theme.row, ...theme.w_90 }}>
                                                <View>
                                                    <Text style={{ fontSize: 13, ...theme.pl_5, ...theme.gray, flexShrink: 1 }}>{row.address}</Text>
                                                    <Text style={{ fontSize: 13, ...theme.pl_5, ...theme.orange }}>{row.location_note}</Text>
                                                </View>
                                            </View>

                                        </View>

                                        <View style={{...theme.row,...theme.jc_space_between}}>
                                            {
                                                row.history.map((history, h_index) => {
                                                    if (history.status == 1) {
                                                        return <Text key={h_index} style={{ ...theme.gray, ...theme.f_12}}>
                                                                <Text>Arrived : </Text>
                                                            {moment(history.created_at).format("hh:mm a")}</Text>
                                                    }
                                                    else if (history.status == 2) {
                                                        return <Text key={h_index} style={{ ...theme.gray, ...theme.f_12}}>Picked Up : {moment(history.created_at).format("hh:mm a")}</Text>
                                                    }
                                                })
                                            }
                                        </View>
                                    </View>
                                )

                            })
                        }

                    </View>

                    {/* Dropoffs */}

                    <View style={{ ...theme.mt_0 }}>
                        <Text  style={{ ...theme.heading_font, ...theme.f_18, ...theme.black, ...theme.mt_10 }}>Dropoffs</Text>
                        {
                            data.dropoff_locations.map((row, key) => {
                                return (
                                    <View key={key} style={{ backgroundColor: 'white', borderColor: '#e8e8e8', borderWidth: 1, ...theme.p_15, borderRadius: 10, ...theme.mt_10 }}>
                                        <View style={{ ...theme.row, backgroundColor: 'white' }}>
                                            <Image
                                                source={dropoffPin}
                                                style={{ width: 18, height: 22, marginTop: 4, resizeMode: "contain" }}
                                            />
                                            <View style={{ ...theme.row, ...theme.w_90 }}>
                                                <View>
                                                    <Text style={{fontSize:13, ...theme.pl_5, ...theme.gray, flexShrink: 1 }}>{row.address}</Text>
                                                    <Text style={{ fontSize: 13, ...theme.pl_5, ...theme.orange }}>{row.location_note}</Text>
                                                </View>
                                            </View>

                                        </View>

                                        <View style={{ ...theme.row, ...theme.jc_space_between }}>
                                            {
                                                row.history.map((history, h_index) => {
                                                    if (history.status == 1) {
                                                        return <Text key={h_index} style={{ ...theme.gray ,...theme.f_12}}>
                                                            <Text>Arrived : </Text>
                                                            {moment(history.created_at).format("hh:mm a")}</Text>
                                                    }
                                                    else if (history.status == 3) {
                                                        return <Text key={h_index} style={{ ...theme.gray, ...theme.f_12 }}>Dropped : {moment(history.created_at).format("hh:mm a")}</Text>
                                                    }
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }

                    </View>



                    <View style={{...theme.mt_25}}>
                        <ThemeButton text="HOME" width={130} height={40} style={{ alignSelf: 'center'}}
                            onPressAction={()=>props.navigation.navigate("Home")}
                        ></ThemeButton>
                    </View>
                </ScrollView>
            </LinearGradient>
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

export default connect(null, mapDispatchToProps)(JobCompleted)