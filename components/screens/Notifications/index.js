
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
// Theme Elements
import theme from '../../theme/style'
import notification from '../../../assets/app/notification.png'
import ScreenLoader from '../component/ScreenLoader';
import useJwt from '../../util/util';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

const screenHeight = Dimensions.get('screen').height;
function Notifications(props) {
    const formMethods = useForm();
    const onSubmit = data => console.log(data);
    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    // let { id } = props.route.params;

    React.useEffect(()=>{
        const Run = async()=>{
         useJwt.setToken(props.user.token);
           await useJwt.get("Notifications").then(async(res)=>{

                if(res.data){
                    setData(res.data.data.notifications);
                    setLoaded(true);
                }
            }).catch(function (error) {

                if (error.response) {
                    // Request made and server responded
                    //notifyError('Error!', '', data.message)
                } else if (error.request) {
                    // The request was made but no response was received
                   // console.log(error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    //console.log('Error', error.message)
                }
            })
        }
        Run();
    }, [])
    if(loaded){

        return (

            <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen,height:'100%'}} >
                <NotificationsComponents data={data} {...props} />
            </View>
        )
    }
    else{
        return <ScreenLoader />
    }
}

const NotificationsComponents = (props)=>{

    if (Object.values(props.data).length > 0) {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 30, paddingBottom: 0, marginTop: 20 }}>
                <StatusBar backgroundColor="transparent" />
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.goBack()
                    }}
                    style={{
                        ...theme.py_10,
                        justifyContent: 'flex-start',
                        alignSelf: 'flex-start'
                    }}
                >
                    <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
                </TouchableOpacity>
                <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Notifications</Text>
                <View>
                    <Text style={{ ...theme.f_16 }}>{Object.values(props.data).length} Notifications</Text>
                </View>
                <View style={{...theme.py_15}}>
                    {Object.values(props.data).map((row , key)=>{
                        return (
                            <TouchableOpacity key={key} onPress={() => {
                                if (row.type == 1) {
                                    props.navigation.navigate(row.to_screen,{id:row.primary_id})
                                }
                            }} style={{ backgroundColor: 'white', ...theme.w_100, ...theme.p_15, ...theme.br_10 , ...theme.mb_10,borderWidth:1,borderColor:'#E9E8E8',}}>
                                <View style={{ ...theme.row, ...theme.jc_space_between }}>
                                    <Text style={{ ...theme.f_w_bold, ...theme.f_16 }}>{row.title}</Text>
                                    <Text style={{ ...theme.f_12, ...theme.orange }}>2021-08-10 11:33:50</Text>
                                </View>

                                <Text style={{ ...theme.mt_5 }}>{row.message}</Text>
                            </TouchableOpacity>
                        )
                    })}

                </View>

            </ScrollView>
        )
    }
    else{
        return (
            <View style={{ ...theme.row, ...theme.jc_center ,alignItems:'center',height:'100%',paddingHorizontal:20}}>
                <View style={{ alignItems: 'center',paddingBottom:100}}>
                    <View style={{ ...theme.p_20, width: 120, height: 120, backgroundColor: 'white', borderRadius:100, ...theme.row, ...theme.jc_center, ...theme.align_center}}>
                        <Image source={notification} style={{ width: 60, resizeMode: 'contain' }}></Image>
                    </View>
                    <View style={{...theme.mt_15}}>
                        <Text style={{ ...theme.f_18, ...theme.f_w_bold}}>Your Notification List is Empty</Text>
                    </View>
                    <View style={{...theme.mt_15,alignItems:'center'}}>
                        <Text style={{ ...theme.f_14, textAlign:'center'}}>Stay tuned! Notifications about your order will shows up here</Text>
                    </View>
                </View>
            </View>
        )

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
export default connect(mapStateToProps, mapDispatchToProps)(Notifications)