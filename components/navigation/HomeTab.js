
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  ActivityIndicator} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Switch, Overlay} from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native'
import Home from '../screens/home';
import theme from '../theme/style'
import { render } from 'react-dom';
import useJwt from '../util/util';
import { connect } from 'react-redux';

const Tab = createBottomTabNavigator();

function HomeTabs(props) {
    return (
        <Tab.Navigator screenOptions={{ tabBarStyle: {...style.main } }}>
            <Tab.Screen options={{
                headerShown: false,
                tabBarButton: ({ focused }) => {
                    return <TabComponents {...props} />

                },
                tabBarShowLabel: false,
            }} style={{ width: '100%', backgroundColor: 'gray' }}
                name="HomeTab" component={Home} />
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
            <View style={{ ...theme.row, ...theme.px_10, ...theme.align_center,width:'33.333%',justifyContent:'center' }}>
                <Icon type="feather" name="user" color="gray" />
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("JobCategories")}
                    style={{
                        ...theme.row,
                        width: 60,
                        height: 60,
                        ...theme.bg_white,
                        ...theme.br_50,
                        marginTop: -40,
                        borderColor: theme.purple.color,
                        borderWidth: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon type="ionicon" solid={true} name="add-outline" color={theme.purple.color} size={40} />
                </TouchableOpacity>
            </View>
            <View style={{ ...theme.row, ...theme.px_15, ...theme.py_10, ...theme.align_center, justifyContent: 'center', width: '33.333%' }}>
                <Icon type="feather" name="dollar-sign" color="gray" />
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

export default HomeTabs