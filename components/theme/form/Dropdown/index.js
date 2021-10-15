import * as React from 'react';
import GradientButton from 'react-native-gradient-buttons';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, Animated, Text, View, Image, TextInput, ScrollView  } from 'react-native';
import { useFormContext, useController } from 'react-hook-form';
import theme from '../../style';
export default function Dropdown(props) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [items, setItems] = React.useState(props.items);

    const { name, rules, defaultValue, error } = props
    const formContext = useFormContext();
    const { control } = formContext;
    const { field } = useController({
        name,
        control,
        rules,
        defaultValue
    })

    const onChangeValue = (value)=>{
        formContext.setValue(name,value);
        setValue(value);
    }
    const labelRef = React.useRef(new Animated.Value(0)).current;
    const inputRef = React.useRef();
    const focusIn = () => {
        Animated.timing(
            labelRef,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    }


    const focusOut = () => {
        Animated.timing(
            labelRef,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    }
    return (
        <View style={{ marginVertical: 7, width: '100%', borderColor: error ? theme.purple.color : '#E9E8E8', borderBottomWidth: 1, ...props.MainConatainerStyle }}>
            {props.Label ? <Animated.View style={{
                opacity: 1
            }}><Text style={{ ...props.IconStyle, color: '#a2a2a2' }}>{props.Label}</Text></Animated.View> : <></>}
            <View style={{ flexDirection: 'row' }}>

                {/* {props.Icon ? <View style={{ paddingVertical: 15, paddingHorizontal: 15,...props.IconStyle}}>{props.Icon}</View> : <></>} */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 0, paddingHorizontal: 0, ...props.InputConatainerStyle }}>

                    <DropDownPicker
                        listMode="MODAL"
                        theme="LIGHT"
                        style={{ paddingVertical: 5 }}
                        onChangeText={field.onChange}
                        value={field.value}
                        defaultValue={defaultValue}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={onChangeValue}
                        setItems={setItems}
                        containerStyle={{width:'100%'}}
                        style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 0, borderWidth: 0, width: '100%'}}
                        {...props.TextInput} />

                </View>
                {props.IconRight ? <View style={{ paddingVertical: 0, paddingHorizontal: 15 }}>{props.IconRight}</View> : <></>}

            </View>

        </View>
    )
}