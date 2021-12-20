
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform, SafeAreaView, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { Rating, AirbnbRating } from 'react-native-ratings';
// Theme Elements
import theme from '../../theme/style'
import ScreenLoader from '../component/ScreenLoader';
import useJwt from '../../util/util';
import { connect } from 'react-redux';
import { useForm, Controller,FormProvider } from "react-hook-form";
/// Icons
import { Icon } from 'react-native-elements';
import checked from "../../../assets/app/checked.png";
import ThemeButton from '../../theme/buttons';
import moment from 'moment';


import pickupPin from "../../../assets/app/pickup.png";
import dropoffPin from "../../../assets/app/dropoff.png";
import jwtDefaultConfig from '../../util/jwtDefaultConfig';
import { TextInput } from 'react-native-paper';
import ThemeInput from '../../theme/form/Input';
import { Overlay } from 'react-native-elements';
 function JobCompleted(props) {


    const { task_id } = props.route.params;
    const [loaded, setLoaded] = React.useState(false);
    const [data, setData] = React.useState(true);
    const [ratting, setRating] = React.useState(3);
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const refRBSheet = React.useRef();
    const formMethods = useForm();

     const isRated = async (rate) =>{
        setTimeout(() => {
            console.log("hello")
            if (rate) {
                if (Object.keys(rate).length == 0) {
                    if (refRBSheet.current){
                        refRBSheet.current.open()
                    }

                }
            }
        }, 1500);

    }

     const submitRatting=  (formData) =>{
         setOverlayVisible(true)
         useJwt.post("customers/Orders/add_rating", { job_id: task_id, rating_points: ratting, note: formData.note}).then(async (res) => {

             if (res.data.status) {
                 setOverlayVisible(false)
                 refRBSheet.current.close()
                 Run();
                 /// Check is ratted by customer
             }
         }).catch(function (error) {
             console.log(error.response)
         })
     }
     const Run = () => {
        setLoaded(false);
        useJwt.post("drivers/Jobs/job_view", { job_id: task_id }).then(async (res) => {

             if (res.data.data) {

                 await setData(res.data.data.job_detail);
                 await setLoaded(true);
                 /// Check is ratted by customer
                 isRated(res.data.data.job_detail.rate_by_customer)
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
    React.useEffect(()=>{
        Run();
    }, [task_id])

    if(loaded){

        return (

            <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen }} >
                <StatusBar backgroundColor="transparent" theme="dark" />
                <View style={{ ...theme.px_0, ...theme.mt_20, ...theme.row }}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                        style={{
                            ...theme.py_10,
                            ...theme.px_10,
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start'
                        }}>
                        <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
                    </TouchableOpacity>
                    <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.align_center, width: '80%' }}>
                        <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Job Detail</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100,marginTop:20}} style={{ ...theme.px_30,}}>

                    <View style={{...theme.jc_center,...theme.mt_20,}}>
                        <Image source={checked} style={{ width: 40, height: 40, resizeMode: "contain", alignSelf: 'center'}} />
                        <Text style={{ ...theme.f_28, ...theme.black, ...theme.heading_font, alignSelf: 'center' }}>Job ID #{task_id}</Text>
                    </View>

                    <View style={{ ...theme.mt_25 }}>
                        <View style={{ ...theme.row, ...theme.jc_space_between }}>
                            <Text style={{ ...theme.f_w_bold, ...theme.black }}>Budget : {data.budget} (CAD) </Text>
                        </View>
                    </View>

                    <View style={{...theme.mt_25}}>
                        <View style={{...theme.row,...theme.jc_space_between}}>
                            <Text><Text style={{ ...theme.f_w_bold, ...theme.black  }}> Start</Text> : {moment(data.starting_time).format("hh:mm a")}</Text>
                            <Text><Text style={{ ...theme.f_w_bold, ...theme.black }}> End</Text > : {moment(data.ending_time).format("hh:mm a")}</Text>
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

                    <View style={{ ...theme.mt_0 }}>
                        <Text  style={{ ...theme.heading_font, ...theme.f_18, ...theme.black, ...theme.mt_10 }}>Ratting</Text>
                        {Object.values(data.rate_by_customer).map((rate , key)=>{
                            return <View key={key}>
                                        <Text style={{textAlign:'center'}}>You Rated</Text>
                                        <AirbnbRating
                                            type='custom'
                                            ratingCount={5}
                                            defaultRating={rate.rating_points}
                                            size={20}
                                            readonly={true}
                                            selectedColor={theme.purple.color}
                                            reviewColor={theme.purple.color}
                                            ratingBackgroundColor={'white'}
                                            starContainerStyle={{backgroundColor:'transparent'}}


                                        />
                                        <Text style={{ textAlign: 'center' ,...theme.mt_10 }}>{rate.note}</Text>
                                    </View>
                        })}
                    </View>

                </ScrollView>

                <RBSheet
                    ref={refRBSheet}
                    height={450}
                    // closeOnPressBack={false}
                    closeOnPressMask={false}
                    closeOnDragDown={false}
                    openDuration={250}
                    customStyles={{
                        container: {
                            alignItems: "center"
                        }
                    }}
                >
                    <View style={{width:"100%",...theme.px_30}}>
                        <View style={{ ...theme.my_15 , alignItems:'center'}}>
                            <Text style={{fontWeight:'700',...theme.f_20 , ...theme.my_10, textAlign:'center', ...theme.gray}}>Rate the Driver</Text>

                            <Image style={{ width: 65, height: 65,resizeMode:'contain',borderRadius:200}} source={{ uri: (jwtDefaultConfig.url + data.driver_avatar_path).replace(" ","%20")}} />

                            <Text style={{ fontWeight: '700', ...theme.f_16, ...theme.my_5, textAlign: 'center' ,textTransform:'capitalize' }}>{data.driver_name}</Text>
                        </View>
                        <View style={{ ...theme.my_5 }}>
                            <Rating
                                type='star'
                                ratingCount={5}
                                imageSize={35}
                                showRating
                                startingValue={ratting}
                                ratingTextColor={theme.purple.color}
                                onFinishRating={(rate)=>{
                                    setRating(rate)
                                }}
                            />

                            <FormProvider {...formMethods}>
                                <ThemeInput
                                    MainContainerStyle={{ marginTop: 25 }}
                                    InputConatainerStyle={{ width: '85%' }}
                                    TextInput={{
                                        placeholder: 'Note',
                                        textContentType: 'password',
                                    }}
                                    name='note'
                                    defaultValue=""

                                />

                                <View style={{ ...theme.mt_10 }}>
                                    <ThemeButton text="SUBMIT" width={130} height={40} style={{ alignSelf: 'center' }}
                                        onPressAction={formMethods.handleSubmit(submitRatting)}>

                                    </ThemeButton>
                                </View>
                            </FormProvider>


                        </View>
                    </View>
                </RBSheet>

                <Overlay isVisible={overlayVisible} >
                    <ActivityIndicator size="large" color={theme.purple.color} />
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
        setJobId: (data) => dispatch({ type: 'SET_ONGOING_JOB_ID', payload: data }),
        setPickUps: (data) => dispatch({ type: 'SET_PICKUPS', payload: data }),
        setDropOffs: (data) => dispatch({ type: 'SET_DROPOFFS', payload: data }),
        setCurrentLocationId: (data) => dispatch({ type: 'SET_LOCATION_ID', payload: data }),

    }
}

export default connect(null, mapDispatchToProps)(JobCompleted)