
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  ActivityIndicator} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Switch, Overlay} from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native'
import JobCategories from '../screens/Job/Create/JobCategories';
import theme from '../theme/style'

const Tab = createBottomTabNavigator();

function JobCategoriesTab(props) {
    return (
        <Tab.Navigator screenOptions={{ tabBarStyle: {...style.main } }}>
            <Tab.Screen options={{
                headerShown: false,
                tabBarButton: ({ focused }) => {
                    return <TabComponents {...props} />

                },
                tabBarShowLabel: false,
            }} style={{ width: '100%', backgroundColor: 'gray' }}
                name="HomeTab" component={JobCategories} />
        </Tab.Navigator>
    )
}


function TabComponents(props) {

    const [isEnabledActivity, setIsEnabledActive] = React.useState(false);
    const [isEnabledIntracity, setIsEnabledIntracity] = React.useState(false);
    const [visible, setOverlay] = React.useState(false);
    const toggleSwitchActivity = async (value) => {
        setOverlay(true)
        let status = value
        await useJwt.post("drivers/settings/change_active_status", { status: status }).then((res) => {
            setIsEnabledActive(value);
            setOverlay(false)
        })


    };
    const toggleSwitchIntracity =async (value) => {
        setOverlay(true)
        let status = value
        await useJwt.post("drivers/settings/change_job_type", { status: status }).then((res) => {
            setIsEnabledIntracity(value);
            setOverlay(false)
        })
    };

    const Run = async () => {
        await useJwt.post("drivers/settings/get_status").then((res) => {
            if (res.data) {
                ///Active Status
                if (res.data.active == '0') {
                    setIsEnabledActive(false)
                }
                else {
                    setIsEnabledActive(true)
                }
                ///Job Type
                if (res.data.job_type == '0') {
                    setIsEnabledIntracity(false)
                }
                else {
                    setIsEnabledIntracity(true)
                }
            }
        })
    }
    useEffect(()=>{
        //Run()
    },[])
    //Run()

    return <View style={{ ...style.main }}>
        <View style={{ ...style.footer_container }}>
            <View style={{width:'50%',justifyContent:'center' }}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("JobCategories")}
                    style={{
                        ...theme.row,
                        width: '100%',
                        height: '100%',
                        backgroundColor:'#E66A71',
                        ...theme.jc_center,
                        ...theme.align_center
                    }}
                >
                    <Text style={{...theme.white }}>Schedule</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '50%'}}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("JobCategories")}
                    style={{
                        ...theme.row,
                        width: '100%',
                        height: '100%',
                        ...theme.bg_purple,
                        ...theme.jc_center,
                        ...theme.align_center
                    }}
                >
                    <Text style={{...theme.white}}>Request Now</Text>
                </TouchableOpacity>
            </View>

        </View>
        <Overlay isVisible={visible} >
            <ActivityIndicator size="large" color={theme.purple.color} />
            <Text>Updating...</Text>
        </Overlay>
    </View>

}

const style = StyleSheet.create({
    main: {
        ...theme.w_100,
        ...theme.hp_50,
        borderTopColor: "#f1f1f1",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    footer_container: {
        ...theme.row,
        ...theme.align_center,
        ...theme.jc_space_between
    }
})

export default JobCategoriesTab