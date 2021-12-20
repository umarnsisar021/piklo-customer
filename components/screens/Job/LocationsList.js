import * as React from 'react';
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator} from 'react-native';
import ThemeButton from '../../theme/buttons';
import theme from '../../theme/style';
import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { Overlay } from 'react-native-elements';
import jwtDefaultConfig from '../../util/jwtDefaultConfig';

const ActionButtons = (props)=>{

    if(props.data.location_type == 1){
        if(props.data.status == 0){
            return <ThemeButton
                        disabled={true}
                        disabledGradientBegin={"#dbdbdb"}
                        disabledGradientEnd={"#dbdbdb"}
                        impact
                        text="On Way"
                        textStyle={{ fontSize: 10, color:'black'}}
                        height={30}
                        width={75}
                        style={{ padding: 5, }}

                    />
        }
        else if (props.data.status == 1){
        return <ThemeButton
                    disabled={false}
                    disabledGradientBegin={"#dbdbdb"}
                    disabledGradientEnd={"#dbdbdb"}
                    impact
                    text="Arrived"
                    textStyle={{ fontSize: 10,}}
                    height={30}
                    width={75}
                    style={{ padding: 5, }}
             />
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

                            disabled={true}
                            disabledGradientBegin={"#dbdbdb"}
                            disabledGradientEnd={"#dbdbdb"}
                            impact
                            text={props.clid === props.data.id ? "On Way" : "Awaiting"}
                            textStyle={{ fontSize: 10, color: 'black' }}
                            height={30}
                            width={75}
                            style={{ padding: 5, }}
                    />
            }
            else if(props.data.status == 1){
               return <ThemeButton

                        disabled={false}
                        disabledGradientBegin={"#dedede"}
                        disabledGradientEnd={"#dedede"}
                        impact
                        text="Arrived"
                        textStyle={{ fontSize: 10 }}
                        height={30}
                        width={75}
                        style={{ padding: 5, }} />
            }
            else if(props.data.status == 3){
                return <ThemeButton

                     disabled={true}
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

const Item = (props) =>{

    return (
    <View style={{ ...theme.w_100, ...theme.py_10, ...theme.row, ...theme.jc_space_between }}>
        <View style={{ ...theme.row, ...theme.px_15, width: "60%" }} >
            <Image style={{ width: 20, height: 30, resizeMode: 'contain' }} source={props.data.location_type == 1 ? pickupPin : dropoffPin} />
            <View style={{ ...theme.pl_10 }}>
                <Text numberOfLines={2} style={{ ...theme.f_12, ...theme.gray }}>{props.data.address}</Text>
                {props.data.note ? <Text numberOfLines={2} style={{ fontSize: 11.5, ...theme.gray }}>{props.data.note}</Text> : <></>}

            </View>
        </View>
        <View>
                <ActionButtons data={props.data} clid={props.currentLocationId} />
        </View>
    </View>
)};

function LocationsList(props) {
    const navigation = useNavigation();
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    let locations = Object.keys(props.data.locations ? props.data.locations : {} ).map(key => ({ ...props.data.locations[key] }));
    let driver_avatar = props.data.driver ? (jwtDefaultConfig.url + props.data.driver.avatar_path).replace(" ", "%20") : null
    if (props.data.driver){
        return (
            <SafeAreaView style={{ borderRadius: 100 }}>
                <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.align_center, borderBottomColor: theme.purple.color, borderBottomWidth: 1, ...theme.px_10 }}>
                    <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.pr_15, width: 125 }}>
                        <View style={{ ...theme.py_10, ...theme.row, alignItems: 'center', }}>
                            <Image source={{ uri: driver_avatar }} style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 200 }} />

                            <Text style={{ fontWeight: '700', ...theme.f_16, ...theme.pl_5, textTransform: 'capitalize' }}>{`${props.data.driver.first_name} ${props.data.driver.last_name}`}</Text>

                        </View>
                        {/* <Badge value={`${props.onGoingJob.location_distance} km`} status="success" />
                            <Badge value={`${props.onGoingJob.location_duration} min`} status="success" /> */}
                    </View>
                    <Text style={{ fontWeight: '700' }}>JOB ID# {props.onGoingJob.id}</Text>

                </View>
                <FlatList
                    numColumns={1}
                    data={locations}
                    renderItem={({ item }) => <Item data={item} currentLocationId={props.onGoingJob.current_location_id} />}
                    keyExtractor={data => `${data.latitude}`}
                />
                <Overlay isVisible={overlayVisible} >
                    <ActivityIndicator size="large" color={theme.purple.color} />
                    <Text>Updating.</Text>
                </Overlay>
            </SafeAreaView>
        )

    }
    else{
        return null
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
const mapStateToProps = (state) => {
    const { user, onGoingJob } = state
    return { user: user, userData: user.userDetails, onGoingJob: onGoingJob}
}
export default connect(mapStateToProps, mapDispatchToProps)(LocationsList)
