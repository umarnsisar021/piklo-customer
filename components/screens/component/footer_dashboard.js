import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar, Dimensions, Platform, ActivityIndicator, NativeModules} from 'react-native';

import { Icon, Switch } from 'react-native-elements';
// Theme Elements
import theme from '../../theme/style'
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import useJwt from '../../util/util';
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
export default function FooterDashboard(props) {

    const [isEnabledActivity, setIsEnabledActive] = React.useState(false);
    const [isEnabledIntracity, setIsEnabledIntracity] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const toggleSwitchActivity = () =>{
            setVisible(true);
            setIsEnabledActive(previousState => !previousState);
            let status = isEnabledActivity ? 1 : 0;
            useJwt.post("drivers/settings/change_active_status", { status: status}).then((res)=>{
                setVisible(false);
            })

        };

    const toggleSwitchIntracity = () => {
        setVisible(true);
        setIsEnabledIntracity(previousState => !previousState);
        let status = isEnabledIntracity === true ? '1' : '0';
        useJwt.post("drivers/settings/change_job_type", { status: status}).then((res)=>{
            setVisible(false);
        })
    };


        const Run = async ()=>{
            await useJwt.post("drivers/settings/get_status").then((res)=>{
                if(res.data){
                    ///Active Status
                    if(res.data.active == '0'){
                        setIsEnabledActive(false)
                    }
                    else{
                        setIsEnabledActive(true)
                    }
                    ///Job Type
                    if(res.data.job_type == '0'){
                        setIsEnabledIntracity(false)
                    }
                    else{
                        setIsEnabledIntracity(true)
                    }
                }
            })
        }
        Run()

    return (
        <View style={{ ...style.main}}>
            <View style={{...style.footer_container}}>
                <View style={{ ...theme.row, ...theme.px_10 ,...theme.align_center}}>
                    <Switch value={isEnabledIntracity} color="#F58220" onValueChange={toggleSwitchIntracity} />
                    <Text style={{...theme.white,...theme.ml_5 }}>Intercity</Text>
                </View>

                <View>
                    <TouchableOpacity onPress={()=> props.navigation.navigate("Notifications")} style={{ width: 70, height: 70, ...theme.bg_orange,...theme.br_50, marginTop: -40, borderColor: 'white', borderWidth: 5, alignItems: 'center', justifyContent:'center'}}>
                        <Icon type="ionicon" name="notifications-outline" color={'white'} size={38} />
                    </TouchableOpacity>
                </View>
                <View style={{ ...theme.row, ...theme.px_15, ...theme.py_10, ...theme.align_center}}>
                    <Switch value={isEnabledActivity} color="#F58220" onValueChange={toggleSwitchActivity} />
                    <Text style={{...theme.white,...theme.ml_5}}>Active</Text>
                </View>
            </View>
            <Overlay isVisible={visible} >
                <ActivityIndicator size="large" color="#FFA253" />
                <Text>Updating...</Text>
            </Overlay>
        </View>
    )
}



const style = StyleSheet.create({
    main: {
        ...theme.w_100,
        ...theme.hp_50,
        ...theme.absolute,
        //top: windowHeight - (navbarHeight+60),

        top: Platform.OS == "ios" ? windowHeight - (navbarHeight+60) : windowHeight - (navbarHeight),
        ...theme.white,
        // borderTopColor:"orange",
        // borderTopWidth:1,
        ...theme.bg_green,

        top: Platform.OS == "ios" ? windowHeight - (navbarHeight + 50) : windowHeight - (navbarHeight + 50),
        ...theme.bg_green

    },
    footer_container: {
        ...theme.row,
        ...theme.align_center,
        ...theme.jc_space_between
    }
})

