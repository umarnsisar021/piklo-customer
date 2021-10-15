import * as React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { Icon } from 'react-native-elements';
import GradientButton from 'react-native-gradient-buttons';
export default function AlertMessage(props) {

    const getBackground = () =>{
        switch (props.type) {
            case "success":
                return "#36bc9b80"
            case "warning":
                return "#f6bb4380"
            case "primary":
                return "#4b88e1"
            case "error":
                return "#e9573e80"
            default:
                break;
        }
    }
    const getBorder = () => {
        switch (props.type) {
            case "success":
                return "#36bc9b"
            case "warning":
                return "#f6bb43"
            case "primary":
                return "#4b88e1"
            case "error":
                return "#e9573e"
            default:
                break;
        }
    }
    const getColor = () => {
        switch (props.type) {
            case "success":
                return "#186d58"
            case "warning":
                return "#b98a29"
            case "primary":
                return "#4b88e1"
            case "error":
                return "#b13d29"
            default:
                break;
        }
    }
    const getIcons = () => {
        switch (props.type) {
            case "success":
                return "check-circle"
            case "warning":
                return "exclamation-triangle"
            case "primary":
                return "check-circle"
            case "error":
                return "exclamation-circle"
            default:
                break;
        }
    }
    const style = StyleSheet.create({
        main: {
            width: "100%",
            padding: 10,
            borderWidth: 1,
            backgroundColor: getBackground(),
            borderColor: getBorder(),
            borderRadius:10,
        },
        title:{
            color: getColor(),
            marginLeft:10,
            fontSize:16,
            fontWeight:'500'
        },
        message: {
            color: "white",
            marginLeft: 10,
            fontSize: 14,
            fontWeight: '500',
        }
    })
    return (<View
                style={[style.main]}

            {...props}
        >
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{alignSelf:'flex-start'}}>
                    <Icon type="font-awesome-5" name={getIcons()} color={getColor()} />
                </View>
                <View style={{  }}>
                    <Text style={[style.title, props.titleStyle]}>{props.title}</Text>
                {   props.message ?
                            <Text style={[style.message, props.messageStyle]}>{props.message}</Text> : <></>
                }
                </View>

            </View>
            {
                props.message ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                </View> : <></>
            }


        </View>)
}

