import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Image, TextInput, Animated} from 'react-native';
import { useFormContext,useController } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
export default function ThemeCountryDropdown(props) {
    const { name, rules, defaultValue} = props
    const formContext = useFormContext();
    const [selectedLanguage, setSelectedLanguage] = useState();
    const { control,errors } = formContext;
    const { field } = useController({
        name,
        control,
        rules,
        defaultValue
     })
    const pickerRef = useRef();
    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }
    return (
        <View style={{marginVertical:7,width:'100%',height:55,borderBottomColor: props.error ? '#FFA253':'#E9E8E8',borderBottomWidth:1,borderRadius:5,...props.MainContainerStyle}}>
            {props.Label ? <Animated.View style={{
                opacity: 1
            }}><Text style={{ ...props.IconStyle, color: '#a2a2a2' }}>{props.Label}</Text></Animated.View> : <></>}

                <View  style={{paddingVertical:0,paddingHorizontal:0,...props.InputConatainerStyle}}>

                    <CountryPicker
                        withEmoji
                        withCallingCode
                        withFlagButton
                        withCallingCodeButton
                        countryCode={field.value}
                        onSelect={(country => { field.onChange(country.cca2) })}
                    />

                </View>
        </View>
    )
}