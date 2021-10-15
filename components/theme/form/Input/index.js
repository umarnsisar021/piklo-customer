import React , {  } from "react";
import { StyleSheet, Animated,Text, View, Image, TextInput,} from 'react-native';
import { useFormContext,useController,useForm  } from 'react-hook-form';
import theme from "../../style";
export default function ThemeInput(props) {

    const { name, rules, defaultValue, error} = props
    const formContext = useFormContext();
    const {register} = useForm();
    const { control} = formContext;
    const { field } = useController({
        name,
        control,
        rules,
        defaultValue
     })

    const labelRef = React.useRef(new Animated.Value(0)).current;
    const inputRef = React.useRef();
     const focusIn = () =>{
         Animated.timing(
             labelRef,
             {
                 toValue: 1,
                 duration: 1000,
                 useNativeDriver: true
             }
         ).start();
     }


     const focusOut = () =>{
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
        <View style={{ marginVertical: 7, width: '100%', borderColor: error ? theme.purple.color :'#E9E8E8',borderBottomWidth:1,...props.MainConatainerStyle}}>
            {props.Label ? <Animated.View style={{
                opacity: 1
            }}><Text style={{ ...props.IconStyle, color: '#a2a2a2' }}>{props.Label}</Text></Animated.View> : <></>}
            <View style={{flexDirection:'row'}}>

                {/* {props.Icon ? <View style={{ paddingVertical: 15, paddingHorizontal: 15,...props.IconStyle}}>{props.Icon}</View> : <></>} */}
                <View style={{ paddingVertical: 0, paddingHorizontal: 0, ...props.InputConatainerStyle }}>
                    <TextInput
                        style={{ paddingVertical: 5 }}
                        onChangeText={field.onChange}
                        value={field.value}
                        defaultValue={defaultValue}
                        ref={(elem) => inputRef.current = elem}

                        {...props.TextInput}  />

                </View>
                {props.IconRight ? <View style={{ paddingVertical: 0, paddingHorizontal: 15 }}>{props.IconRight}</View> : <></>}

            </View>

        </View>
    )
}