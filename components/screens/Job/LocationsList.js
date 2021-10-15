import * as React from 'react';
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator} from 'react-native';
import ThemeButton from '../../theme/buttons';
import theme from '../../theme/style';
import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
import { connect } from 'react-redux';
import {  Badge} from 'react-native-elements'
import useJwt from '../../util/util'
import { useNavigation } from '@react-navigation/core';
import { CommonActions  } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';
const ActionButtons = (props)=>{

    if(props.data.location_type == 1){
        if(props.data.status == 0){
            return <ThemeButton
                onPressAction={() => props.updateLocationStatus(props.data.id,1)}
                disabled={props.currentLocationId !== props.data.id ? true : false}
                disabledGradientBegin={"#dedede"}
                disabledGradientEnd={"#dedede"}
                impact
                text="Arrived"
                textStyle={{ fontSize: 10 }}
                height={30}
                width={75}
                style={{ padding: 5, }} />
        }
        else if (props.data.status == 1){
        return <ThemeButton
                onPressAction={() => props.updateLocationStatus(props.data.id,2)}
                disabled={props.currentLocationId !== props.data.id ? true : false}
                disabledGradientBegin={"#dedede"}
                disabledGradientEnd={"#dedede"}
                impact
                text="Picked Up"
                textStyle={{ fontSize: 10 }}
                height={30}
                width={75}
                style={{ padding: 5, }} />
        }
        else if (props.data.status == 2){
            return  <ThemeButton
                disabled={true}
                disabledGradientBegin={"green"}
                disabledGradientEnd={"green"}
                text={<Text>Picked Up</Text>}
                textStyle={{ fontSize: 10,}}
                height={30}
                width={75}
                style={{ padding: 5, }} />
        }
        else {
            return null
        }

    }
    else{
        /// For Dropoffs
        if(props.data.location_type == 2){
            /// To show arrived button
            if(props.data.status == 0){
                return <ThemeButton
                onPressAction={() => props.updateDropLocationStatus(props.data.id,1)}
                disabled={props.currentLocationId !== props.data.id ? true : false}
                disabledGradientBegin={"#dedede"}
                disabledGradientEnd={"#dedede"}
                impact
                text="Arrived"
                textStyle={{ fontSize: 10 }}
                height={30}
                width={75}
                style={{ padding: 5, }} />
            }
            else if(props.data.status == 1){
               return <ThemeButton
                    onPressAction={() => props.updateDropLocationStatus(props.data.id,3)}
                    disabled={props.currentLocationId !== props.data.id ? true : false}
                    disabledGradientBegin={"#dedede"}
                    disabledGradientEnd={"#dedede"}
                    impact
                    text="Drop"
                    textStyle={{ fontSize: 10 }}
                    height={30}
                    width={75}
                    style={{ padding: 5, }} />
            }
            else if(props.data.status == 3){
                return <ThemeButton
                     onPressAction={() => props.updateDropLocationStatus(props.data.id,3)}
                     disabled={props.currentLocationId !== props.data.id ? true : false}
                     disabledGradientBegin={"green"}
                     disabledGradientEnd={"green"}
                     impact
                     text="Dropped"
                     textStyle={{ fontSize: 10 }}
                     height={30}
                     width={75}
                     style={{ padding: 5, }} />
             }
        }

    }

}

const Item = (props) => (
    <View style={{ ...theme.w_100, ...theme.py_10, ...theme.row, ...theme.jc_space_between }}>
        <View style={{ ...theme.row, ...theme.px_15, width: "60%" }} >
            <Image style={{ width: 20, height: 30, resizeMode: 'contain' }} source={props.data.location_type == 1 ? pickupPin : dropoffPin} />
            <View style={{ ...theme.pl_10 }}>
                <Text numberOfLines={2} style={{ ...theme.f_12, ...theme.gray }}>{props.data.address}</Text>
                {props.data.note ? <Text numberOfLines={2} style={{ fontSize: 11.5, ...theme.gray }}>{props.data.note}</Text> : <></>}

            </View>
        </View>
        <View>
            <ActionButtons {...props} />
        </View>
    </View>
);

function LocationsList(props) {
    const navigation = useNavigation();
    const [pickupData, setPickupData] = React.useState(props.onGoingJob.pickups);
    const [dropoffData, setDropoffData] = React.useState(props.onGoingJob.dropoffs);
    const [overlayVisible, setOverlayVisible] = React.useState(false);


    const updateLocationStatus = async (id,status) => {
        setOverlayVisible(true)
        let pickups  = await Object.values(props.onGoingJob.pickups).map((p)=>{
            let temp = p;
            if(temp.id == id){
                temp.status = status;
            }
            return temp
        })
        await props.setPickUps(pickups)
        if (status == 2 || status == 3 ){
            let currentArray = [...props.onGoingJob.pickups, ...props.onGoingJob.dropoffs]
            for (let i = 0; i < currentArray.length; i++) {
                if (currentArray[i]['status'] == 0 || currentArray[i]['status'] == 1) {

                    props.setCurrentLocationId(currentArray[i]['id'])
                    break;
                }
            }
        }
        useJwt.post('drivers/Jobs/location_status_update',{
            job_id: props.onGoingJob.id,
            location_id: id,
            status: status
        }).then(()=>{
            setOverlayVisible(false)
        }).catch((error)=>{
            console.log(error.message)
        });

    }

    const updateDropLocationStatus = async (id,status) => {
        setOverlayVisible(true)
        let dropoffs  = await Object.values(props.onGoingJob.dropoffs).map((d)=>{
            let temp = d;
            if(temp.id == id){

                temp.status = status;
            }
            return temp
        })
        setOverlayVisible(true)
        await props.setDropOffs(dropoffs)
        useJwt.post('drivers/Jobs/location_status_update', {
            job_id: props.onGoingJob.id,
            location_id: id,
            status: status
        }).then(() => {
            setOverlayVisible(false)
         }).catch((error) => {
            console.log(error.message)
        });
        let isLast = false;
        if (status == 2 || status == 3 ){
            let currentArray = [...props.onGoingJob.dropoffs]
            for (let i = 0; i < currentArray.length; i++) {
                /// if last dropoff
                if(i == (currentArray.length - 1)){
                    setOverlayVisible(true)
                    useJwt.post('drivers/Jobs/complete_request', {
                        job_id: props.onGoingJob.id,
                    }).then(async(res) => {
                        if (res.data.state) {
                            setOverlayVisible(false)
                            const resetAction = CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'Home' },
                                    {
                                        name: 'JobCompleted',
                                        params: { task_id: props.onGoingJob.id },
                                    },
                                ],
                                key: null,
                            });
                            navigation.dispatch(resetAction);
                        }

                     }).catch((error) => {
                         if (error.response.data.message == "Already Completed"){
                             const resetAction = CommonActions .reset({
                                 index: 0,
                                 routes: [
                                     { name: 'Home' },
                                     {
                                         name: 'JobCompleted',
                                         params: { task_id: props.onGoingJob.id },
                                     },
                                 ],
                                 key: null,
                             });

                             navigation.dispatch(resetAction);
                         }
                    });

                }
                if (currentArray[i]['status'] == 0 || currentArray[i]['status'] == 1) {
                    props.setCurrentLocationId(currentArray[i]['id'])
                    break;
                }

            }
        }


    }


    return (
            <SafeAreaView style={{ borderRadius:100 }}>
                <View style={{...theme.row,...theme.jc_space_between,...theme.align_center, borderBottomColor:theme.purple.color,borderBottomWidth:1}}>
                    <Text style={{...theme.p_15, fontWeight:'700'}}>JOB ID# {props.onGoingJob.id}</Text>
                    <View style={{ ...theme.row, ...theme.jc_space_between,...theme.pr_15,width:125}}>
                        {/* <Badge value={`${props.onGoingJob.location_distance} km`} status="success" />
                        <Badge value={`${props.onGoingJob.location_duration} min`} status="success" /> */}
                    </View>
                </View>
                <FlatList
                    numColumns={1}
                    data={[...pickupData, ...dropoffData]}
                    renderItem={({ item }) => (<Item updateLocationStatus={updateLocationStatus} updateDropLocationStatus={updateDropLocationStatus} currentLocationId={props.onGoingJob.current_location_id} data={item} />)}
                    keyExtractor={data => data.latitude}
                />
                <Overlay isVisible={overlayVisible} >
                    <ActivityIndicator size="large" color={theme.purple.color} />
                    <Text>Updating.</Text>
                </Overlay>
            </SafeAreaView>
        )

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
const mapStateToProps = (state) => {
    const { user, onGoingJob } = state
    return { user: user, userData: user.userDetails, onGoingJob: onGoingJob}
}
export default connect(mapStateToProps, mapDispatchToProps)(LocationsList)
