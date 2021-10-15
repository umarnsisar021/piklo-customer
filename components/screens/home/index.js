
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm} from "react-hook-form";
// Theme Elements
import theme from '../../theme/style'
import ThemeAlertMessage from '../../theme/AlertMessage'
import RecentActivitiesComponent from './RecentActivitiesComponent'
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import useJwt from '../../util/util'
import ScreenLoader from '../component/ScreenLoader';
import Logo from '../../../assets/app/icon.png'


const screenHeight = Dimensions.get('screen').height;
function Home(props) {
    const navigation = useNavigation();
    const formMethods = useForm();
    const [data,setData] = React.useState({
        total_delivers: 0,
        total_opportunities: 0,
        recent_jobs: [],
    });
    const [loaded, setLoaded] = React.useState(false);
    const Run = async () => {
        setLoaded(false)
        await useJwt.post("drivers/settings/get_dashboard", {}).then((res)=>{
            if(res.data){
                setData(res.data)
                setLoaded(true)
            }
        })

    }
    React.useEffect(()=>{
        Run()
    },[])
    if(loaded){
        return (

            <View id='Main-page' colors={['#FFFFFF', '#FFFFFF']} style={{}} >
                <StatusBar backgroundColor={theme.purple.color} style="light" />
                <View
                    style={{
                        ...theme.row,
                        ...theme.px_30,
                        ...theme.jc_space_between,
                        alignItems: 'center',
                        backgroundColor: theme.purple.color,
                        borderBottomColor:
                        theme.purple.color,
                        borderBottomWidth: 1,
                        marginTop: Platform.OS == "ios" ? 0 : 28,
                        paddingTop: Platform.OS == "ios" ? 28 : 0
                    }}>
                    <TouchableOpacity style={{ width: "33.333%",alignItems:'flex-start' }} onPress={() => props.navigation.openDrawer()}>
                        <Icon name="menu-outline" type="ionicon" size={40} color="white"></Icon>
                    </TouchableOpacity>
                    <View style={{ width: "33.333%",flexDirection:'row',alignItems:'center' }}>
                        <Image source={Logo} style={{ width: 35, height: 35,resizeMode:"contain"}} />
                        <Text style={{ fontFamily: 'FredokaOne', fontSize: 20,color:'white' }}>Piklo</Text>
                    </View>
                    <View style={{ width: "33.333%", flexDirection: 'row', alignItems: 'center' }}>
                        <Text></Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} style={{ ...theme.px_30, paddingTop: 20, }}>
                    {
                        props.user.userProfile.status == 1 ?
                            <ThemeAlertMessage
                                title="Pending"
                                titleStyle={{ fontSize: 16 }}
                                type="warning"
                                message="Your account is under review."
                            /> :
                            <></>
                    }
                    {
                        props.user.userProfile.status == 3 ?
                            <ThemeAlertMessage
                                title="Account Blocked"
                                titleStyle={{ fontSize: 16 }}
                                type="error"
                                message="Your account has been blocked."
                            /> :
                            <></>
                    }


                    <Text style={{ ...theme.f_30, ...theme.gray, ...theme.heading_font }}>Welcome!</Text>
                    <Text
                        style={{
                            ...theme.f_28,
                            ...theme.black,
                            textTransform: 'capitalize',
                            fontFamily: "Barlow_SemiBold"
                        }}>{props.userData.first_name + " " + props.userData.last_name}</Text>



                    <View  {...formMethods}>
                        <View style={{ ...theme.my_10 }}>
                            <Text style={{ ...theme.f_16, ...theme.py_10 }}>Today's Overview</Text>
                            <View style={{ ...theme.row, ...theme.jc_space_between }}>
                                {/* Component */}
                                <LinearGradient
                                    colors={['#ffffff', '#ffffff']}
                                    style={{
                                        ...theme.w_45,
                                        ...theme.hp_100,
                                        ...theme.p_5,
                                        ...theme.br_10,
                                        ...theme.text_left
                                    }}>
                                    <Icon
                                        style={{ alignSelf: "flex-start", opacity: 0.5 }} name="checkmark-done-outline" type="ionicon" size={40}
                                        color={theme.purple.color}
                                    />
                                    <View style={{ ...theme.absolute, right: 10, bottom: 10, ...theme.text_center }}>
                                        <Text style={{ ...theme.text_right, ...theme.black, ...theme.f_28 , fontWeight:'600' }}>{data.total_delivers}</Text>
                                        <Text style={{ ...theme.purple, ...theme.f_14 }}>Delivered</Text>
                                    </View>
                                </LinearGradient>
                                {/* Component End */}
                                {/* Component */}
                                <LinearGradient
                                    colors={['#ffffff', '#ffffff']}
                                    style={{
                                        ...theme.w_45,
                                        ...theme.hp_100,
                                        ...theme.p_5,
                                        ...theme.br_10,
                                        ...theme.text_left
                                    }}>
                                    <Icon
                                        style={{ alignSelf: "flex-start", opacity: 0.5 }} name="checkmark-done-outline"
                                        type="ionicon"
                                        size={40}
                                        color={theme.purple.color} />
                                    <View style={{ ...theme.absolute, right: 10, bottom: 10, ...theme.text_center }}>
                                        <Text style={{ ...theme.text_right, ...theme.black, ...theme.f_28 }}>{data.total_opportunities}</Text>
                                        <Text style={{ ...theme.purple, ...theme.f_14 }}>Opportunities</Text>
                                    </View>
                                </LinearGradient>
                                {/* Component End */}
                            </View>
                        </View>

                    </View>
                    <View style={{ ...theme.hp_20 }} />
                    <RecentActivitiesComponent data={data.recent_jobs} />
                </ScrollView>
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
        setUserData: (data) => dispatch({ type: 'SET_USER_DETAILS', payload: data }),
        setUserId: (data) => dispatch({ type: 'SET_USER_ID', payload: data }),
        setLogin: (data) => dispatch({ type: 'SET_LOGIN', payload: data }),
        setToken: (data) => dispatch({ type: 'SET_TOKEN', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user } = state
    return { user: user, userData: user.userDetails}
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)


