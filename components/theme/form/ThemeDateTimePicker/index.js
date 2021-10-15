import React, { useState } from 'react';
import { View, Text, Button, Platform, Animated, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormContext, useController } from 'react-hook-form';
import { Alert } from 'react-native';
import Moment from 'react-moment';
import moment from 'moment';
import theme from '../../style';
import { Modal } from 'react-native-paper';

export default function ThemeDateTimePicker(props) {


    const [date, setDate] = useState(null);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const { name, rules, defaultValue, error } = props
    const formContext = useFormContext();
    const { control } = formContext;
    const { field } = useController({
        name,
        control,
        rules,
        defaultValue
    })

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



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        let formated = moment(currentDate).format("YYYY-MM-DD");
        setDate(formated);
        formContext.setValue(name, formated)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        setShow(true);
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    return (
        <View style={{ marginVertical: 7, width: '100%', borderColor: error ? theme.purple.color : '#E9E8E8', borderBottomWidth: 1, zIndex:100, ...props.MainConatainerStyle }} >
            {props.Label ? <Animated.View style={{
                opacity: 1
            }}>
            <Text style={{ ...props.IconStyle, color: '#a2a2a2' }}>{props.Label}</Text></Animated.View> : <></>}
            <View style={{ flexDirection: 'row' }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 0, paddingHorizontal: 0, ...props.InputConatainerStyle }} >
                    <TouchableOpacity onPress={() => showDatepicker()}>

                        <Text style={{ marginTop: 15, color: field.value ? 'black' : date ? 'black': '#a2a2a2'  }} >{field.value ? field.value : date ? date : props.TextInput.placeholder}</Text>
                    </TouchableOpacity>

                    {/* {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(1598051730000)}
                            mode={mode}
                            is24Hour={true}
                            display="calendar"
                            textColor="red"
                            onChange={onChange}

                        />
                    )} */}
                </View>

                {props.IconRight ? <View style={{ paddingVertical: 0, paddingHorizontal: 15 }}>{props.IconRight}</View> : <></>}

            </View>


            {show && (
                    <Modal
                        theme={{
                            colors: {
                                backdrop: 'transparent',
                            },
                        }}
                        visible={true}
                        contentContainerStyle={{opacity:0,}}
                        >
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(1598051730000)}
                                mode={mode}
                                is24Hour={true}
                                display="calendar"
                                textColor="red"
                                onChange={onChange}

                            />
                </Modal>
                )
            }
        </View>
    )
}