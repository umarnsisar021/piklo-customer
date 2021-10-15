
import * as React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { Icon, Switch } from 'react-native-elements';
// Theme Elements

import theme from '../../theme/style'

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;


export default function OrderHistoryFooter(props) {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View style={{ ...style.main }}>
            <View style={{ ...style.footer_container }}>
                <View style={{ ...theme.row, ...theme.px_10, ...theme.align_center }}>
                    <Text style={{ ...theme.white }}>Accounts</Text>
                </View>
                <View>
                    <TouchableOpacity style={{ width: 70, height: 70, ...theme.bg_orange, ...theme.br_50, marginTop: -40, borderColor: 'white', borderWidth: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon type="entypo" name="credit" color={'white'} size={38} />
                    </TouchableOpacity>
                </View>
                <View style={{ ...theme.row, ...theme.px_15, ...theme.py_10, ...theme.align_center }}>
                    <Text style={{ ...theme.white }}>Withdrawal</Text>
                </View>
            </View>
        </View>
    )
}



const style = StyleSheet.create({
    main: {
        ...theme.w_100,
        ...theme.hp_60,
        ...theme.absolute,
        top: windowHeight-100 ,
        ...theme.bg_green
    },
    footer_container: {
        ...theme.row,
        ...theme.align_center,
        ...theme.bg_green,
        ...theme.jc_space_between
    }
})

