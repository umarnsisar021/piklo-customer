import React, { useState, useRef } from "react";
import {StyleSheet, Text, View, Image, TextInput,} from 'react-native';
import { useFormContext,useController } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
export default function ThemeSelect(props) {
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
        <View style={{flexDirection:'row',marginVertical:7,width:'100%',height:55,borderBottomColor: props.error ? '#FFA253':'#E9E8E8',borderBottomWidth:1,borderRadius:5,...props.MainConatainerStyle}}>

                <View  style={{paddingVertical:15,paddingHorizontal:0,...props.InputConatainerStyle}}>
                    <Picker
                        itemStyle={{}}
                        style={{margin:-12}}
                        ref={pickerRef}
                        mode="dropdown"
                        onBlur={field.onBlur}
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        {...props.SelectInput}>
                        {props.items ? props.items.map((item, index) => (
                            <Picker.Item key={index} label={item.label} value={item.value} />
                        )) : <Picker.Item label='' value='' /> }
                    </Picker>
    
                </View>
        </View>
    )
}