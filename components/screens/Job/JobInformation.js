import * as React from 'react';
import { Text, ScrollView, ActivityIndicator, View, Image, Dimensions, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { useForm} from "react-hook-form";
import DashedLine from 'react-native-dashed-line';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
// Theme Elements
import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
import theme from '../../theme/style'
import ThemeButton from './../../theme/buttons/index'
import ScreenLoader from '../component/ScreenLoader';
import useJwt from '../../util/util';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import { Overlay } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.28;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const GOOGLE_API_KEY = 'AIzaSyBI2fhIlMNIDnMDI5ciYHe69ugSydNzsX4';
 function JobInformation(props) {

    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(null);
    const [coordinates, setCoordinates] = React.useState([]);
    const [overlayVisible, setOverlayVisible] = React.useState(false);
     let { id } = props.route.params;

    React.useEffect(()=>{
        const Run = async()=>{
            await useJwt.setToken(props.user.token);
            await useJwt.exitRefreshCookies();
            await useJwt.post("drivers/Jobs/job_view", { job_id: id}).then(async(res)=>{

                    if(res.data.data){

                        setData(res.data.data.job_detail);
                        let cor = [];
                        await Object.values(res.data.data.job_detail.pickups_locations).map((row, key) => {
                            cor.push({ latitude: parseFloat(row.latitude), longitude: parseFloat(row.longitude), type: 0 });
                        })
                        await Object.values(res.data.data.job_detail.dropoff_locations).map((row, key) => {
                            cor.push({ latitude: parseFloat(row.latitude), longitude: parseFloat(row.longitude), type: 1 });
                        })
                        setCoordinates(cor);
                        setLoaded(true);
                    }
            }).catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    const data = error.response.data
                    console.log(data)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                    //notifyError('Error!', '', data.message)
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message)
                }
            })
        }
        Run();
    }, [id])


    const acceptAction = () =>{
        setOverlayVisible(true)
        useJwt.post("drivers/Jobs/accept_request", { job_id: id}).then((res)=>{
            if (res) {
                props.navigation.navigate("OngoingJob", { task_id: id, data: data })
                setOverlayVisible(false)
            }
        }).catch((error)=>{
            let toast = Toast.show(error.response.data.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                visible: true,
                backgroundColor: '#ff9d9d',
                textColor: '#000000',
                delay: 0,

            });
            setOverlayVisible(false)
        })
    }

    if(loaded){
        let date = '';
        return (

            <View id='Main-page'  colors={['#FFFFFF', '#FFFFFF']} style={{ ...theme.main_screen,backgroundColor:'white' }} >
                <StatusBar backgroundColor="transparent" />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }} style={{ ...theme.px_30, }}>
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={()=>{
                            props.navigation.goBack()
                        }}
                        style={{
                            ...theme.py_10,
                            justifyContent:'flex-start',
                            alignSelf:'flex-start'
                        }}
                    >
                        <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
                    </TouchableOpacity>
                    <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Job Info</Text>
                    {/* Row */}
                    <View style={{...theme.row,...theme.jc_space_between}}>
                        <Text style={{ ...theme.f_16 }}>{data.job_type == 1 ? "Intracity" :"Intercity"} - Scheduled</Text>
                        <View style={{borderRadius:20,backgroundColor:'green'}}>
                            <Text style={{...theme.f_1, ...theme.white, ...theme.px_20, ...theme.py_5,}}>{data.current_job_status == "Looking for Driver" ?  "Submited": ""}</Text>
                        </View>

                    </View>
                    {/* Row */}
                    <View style={{...theme.row,...theme.jc_space_between,...theme.mt_20}}>
                        <View style={{...theme.row,...theme.align_center}}>
                            <Icon
                                name='package'
                                type='feather'
                                color={theme.purple.color}
                                size={36}
                            />
                            <Text style={{ ...theme.f_24, color:'#7B7B7B',...theme.pl_5}}>{id}</Text>
                        </View>
                        <View style={{...theme.row,...theme.align_center}}>
                            <Icon
                                name='check-circle'
                                type='feather'
                                color='green'
                                size={26}
                            />
                            <Text style={{ ...theme.f_18, color: '#7B7B7B', ...theme.pl_5 }}>{data.customer_name}</Text>
                        </View>
                    </View>

                    <View style={{ ...theme.row, ...theme.jc_space_between,...theme.mt_15,...theme.pb_5}}>
                        <Text style={{ ...theme.f_14, ...theme.gray }}>Date</Text>
                        <Text style={{ ...theme.f_14, ...theme.purple }}>{data.starting_time}</Text>
                    </View>
                    <DashedLine dashLength={5} dashThickness={1} dashGap={5} dashColor='#707070' />
                    {/*  */}
                    <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.mt_15, ...theme.pb_5 }}>
                        <Text style={{ ...theme.f_14, ...theme.gray }}>Category</Text>
                        <Text style={{ ...theme.f_14, ...theme.purple }}>{data.category_name}</Text>
                    </View>
                    <DashedLine dashLength={5} dashThickness={1} dashGap={5} dashColor='#707070' />
                    {/*  */}
                    <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.mt_15, ...theme.pb_5 }}>
                        <Text style={{ ...theme.f_14, ...theme.gray }}>Estimated Time</Text>
                        <Text style={{ ...theme.f_14, ...theme.purple }}>{data.estimate_time} Mins</Text>
                    </View>
                    <DashedLine dashLength={5} dashThickness={1} dashGap={5} dashColor='#707070' />
                    {/*  */}
                    <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.mt_15, ...theme.pb_5 }}>
                        <Text style={{ ...theme.f_14, ...theme.gray }}>Budget (C$)</Text>
                        <Text style={{ ...theme.f_14, ...theme.purple }}>{data.budget}-{parseInt(data.budget) + parseInt(data.estimated)}</Text>
                    </View>
                    <DashedLine dashLength={5} dashThickness={1} dashGap={5} dashColor='#707070' />

                    {/* MAP VIEW  */}
                    <View style={{ width: '100%', ...theme.my_15, borderRadius: 10, flex: 1, borderColor: theme.purple.color, borderWidth: 1, position:'relative',overflow:'hidden'}}>

                        <MapView style={{ height: 200}}
                            maxZoomLevel={20 }
                            minZoomLevel={13}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: 24.8578096,
                                longitude: 67.0596778,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}>
                            {/* Pickups */}
                            {Object.values(coordinates).map( (row, key) => {

                                return <Marker
                                            key={key}
                                            coordinate={{ latitude: row.latitude, longitude: row.longitude }}
                                >

                                    <Image source={row.type == 0 ? pickupPin : dropoffPin} style={{ width: 26, height: 28 }}
                                        resizeMode="contain"/>
                                </Marker>
                            })}
                            <Polyline
                                coordinates={coordinates}
                                strokeColor="#707070"
                                strokeWidth={Platform.OS == "ios" ? 2:4 }
                                lineDashPhase={10}
                                lineDashPattern={[10,10]}
                            />
                        </MapView>

                    </View>

                    <View style={{...theme.row, ...theme.jc_space_between, ...theme.mt_15, ...theme.pb_5 }}>
                        <Text style={{ ...theme.f_14, ...theme.gray }}>Pickup(s) {Object.keys(data.pickups_locations).length}</Text>
                        <Text style={{ ...theme.f_14, ...theme.purple }}>|</Text>
                        <Text style={{ ...theme.f_14, ...theme.gray }}>Dropoff(s) {Object.keys(data.dropoff_locations).length}</Text>
                        <Text style={{ ...theme.f_14, ...theme.purple }}>|</Text>
                        <Text style={{ ...theme.f_14, ...theme.purple }}>Safe Drop</Text>
                    </View>
                    <DashedLine dashLength={5} dashThickness={1} dashGap={5} dashColor='#707070' />
                    {/*  */}
                    <View>
                        {/* LIST ITEMS */}
                        {Object.values(data.pickups_locations).map((row,key)=>{
                            return (
                                <View key={key} style={{ ...theme.row, ...theme.jc_space_between, ...theme.mt_15, ...theme.pb_5 }}>
                                    <View>
                                        <View style={{ ...theme.row }}>
                                            <Image
                                                source={pickupPin}
                                                style={{width:18,height:22,marginTop:4, resizeMode:"contain" }}
                                            />
                                            <View style={{ ...theme.row, ...theme.w_90 }}>
                                                <View>
                                                    <Text style={{ ...theme.f_14, ...theme.pl_5, ...theme.gray, flexShrink: 1 }}>{row.address}</Text>
                                                    <Text style={{ ...theme.f_14, ...theme.pl_5, ...theme.purple }}>{row.location_note}</Text>
                                                </View>
                                                {/* <Text style={{ ...theme.f_14, ...theme.pl_5, ...theme.gray }}>18 March 2021 11:52 am</Text> */}
                                            </View>

                                        </View>


                                    </View>
                                    {/* <View>
                                        <Icon name='thumbs-up' type='font-awesome' color='#00C406' size={36} />
                                    </View> */}
                                </View>
                            )
                        })}


                        {Object.values(data.dropoff_locations).map((row, key) => {
                            return (
                                <View key={key} style={{ ...theme.row, ...theme.jc_space_between, ...theme.mt_15, ...theme.pb_5 }}>
                                    <View>
                                        <View style={{ ...theme.row }}>
                                            <Image
                                                source={dropoffPin}
                                                style={{ width: 18, height: 22, marginTop: 4, resizeMode: "contain" }}
                                            />
                                            <View style={{ ...theme.row,...theme.w_90 }}>
                                                <View>
                                                    <Text style={{ ...theme.f_14, ...theme.pl_5, ...theme.gray, flexShrink: 1}}>{row.address}</Text>
                                                    <Text style={{ ...theme.f_14, ...theme.pl_5, ...theme.purple }}>{row.location_note}</Text>
                                                </View>
                                                {/* <Text style={{ ...theme.f_14, ...theme.pl_5, ...theme.gray }}>18 March 2021 11:52 am</Text> */}
                                            </View>
                                        </View>

                                    </View>
                                    {/* <View>
                                        <Icon name='thumbs-up' type='font-awesome' color='#00C406' size={36} />
                                    </View> */}
                                </View>
                            )
                        })}

                    </View>
                    {/* ACTION BUTTON */}
                    <View style={{...theme.row,...theme.jc_space_between,...theme.py_20,alignItems:'center'}}>
                        {/* <TouchableOpacity style={{backgroundColor: '#FF0000', ...theme.w_45,...theme.align_center,...theme.py_15,...theme.br_5}}>
                            <Text style={{ ...theme.white, ...theme.f_18}}>DECLINE</Text>
                        </TouchableOpacity> */}
                        <ThemeButton text="DECLINE" width="45%" onPressAction={() => props.navigation.navigate("OngoingJob", { task_id: id, data: data })} gradientBegin="#E66A71" gradientEnd="#E66A71" style={{marginBottom:0}}/>
                        <ThemeButton text="ACCEPT" width="45%" onPressAction={() => acceptAction() } style={{}}/>
                    </View>

                </ScrollView>
                <Overlay isVisible={overlayVisible} >
                    <ActivityIndicator size="large" color="#FFA253"  />
                    <Text>Submitting your request.</Text>
                </Overlay>
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
        setDeviceId: (data) => dispatch({ type: 'SET_DEVICE_ID', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user } = state
    return { user: user, userData: user.userDetails }
}
export default connect(mapStateToProps, mapDispatchToProps)(JobInformation)