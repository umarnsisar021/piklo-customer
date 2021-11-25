
import React, { } from "react";
import { StyleSheet, Text, View, Image, TextInput,TouchableOpacity } from 'react-native';
import theme from '../style';
export default function ThemeStepList(props) {


    return (
        <TouchableOpacity
            onPress={props.onPress ? props.onPress : null}
            style={{...theme.row,...theme.my_15,...theme.w_100 ,...theme.align_center,...props.MainContainerStyle }}>
            <View
                colors={['#E66A71', '#CB587F',]}
                style={{
                    ...theme.br_25,
                    ...theme.bg_gray,
                    ...theme.hp_50,
                    ...theme.wp_50,
                    ...theme.align_center,
                    ...theme.jc_center,
                    ...theme.white,
                    ...theme.f_22,
                    ...theme.text_center,
                    ...theme.text_v_center,

                }}
            >
                <Text style={{...theme.f_18,...theme.white}}>{props.bulletNumber}</Text>
            </View>

            <View
                style={{
                    ...theme.px_10
                }}
            >
                <Text
                    style={{
                        ...theme.f_18,
                        ...theme.black,
                        fontWeight:'600',
                    }}
                >
                    {props.name}
                </Text>
                <Text
                    style={{
                        ...theme.f_14,
                        color:props.statusColor,
                    }}
                >
                    {props.status}
                </Text>
            </View>
        </TouchableOpacity>
    )
}