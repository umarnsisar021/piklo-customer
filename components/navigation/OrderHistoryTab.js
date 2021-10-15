
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  ActivityIndicator} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Switch, Overlay} from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native'
import OrderHistory from '../screens/OrderHistory';
import theme from '../theme/style'
import { render } from 'react-dom';
import useJwt from '../util/util';
import { connect } from 'react-redux';

const Tab = createBottomTabNavigator();

function OrderHistoryTab(props) {
    return (
        <Tab.Navigator screenOptions={{ tabBarStyle: {...style.main } }}>
            <Tab.Screen options={{
                headerShown: false,
                tabBarButton: ({ focused }) => {
                    return <TabComponents {...props}/>
                },
                tabBarShowLabel: false,
            }} style={{ width: '100%', backgroundColor: 'gray' }}
                name="OrderHistoryTab" component={OrderHistory} />
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
    Run()

    return <View style={{ ...style.main }}>
        <View style={{ ...style.footer_container }}>
            <View style={{...theme.py_10}}>
                <Text style={{ ...theme.purple, ...theme.ml_10 }}>Accounts </Text>
            </View>
            <View >
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Notifications")}
                    style={{
                        width: 60,
                        height: 60,
                        ...theme.br_50,
                        ...theme.bg_white,
                        marginTop: -40,
                        borderColor: theme.purple.color,
                        borderWidth: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon type="entypo" name="credit" color={theme.purple.color} size={28} />
                </TouchableOpacity>
            </View>
            <View >
                <Text style={{ ...theme.purple, ...theme.mr_10 }}>Withdrawal</Text>
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
        borderTopWidth: 1
    },
    footer_container: {
        ...theme.row,
        ...theme.align_center,
        ...theme.jc_space_between
    }
})

export default OrderHistoryTab