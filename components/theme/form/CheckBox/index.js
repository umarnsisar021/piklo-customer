import * as React from 'react';
import CheckBox from '@react-native-community/checkbox';
import { CheckBox as CheckBoxIOS}   from 'react-native-elements'
import { View,Text ,Platform } from 'react-native';
import { useFormContext,useController } from 'react-hook-form';
import { Icon } from 'react-native-elements';
export default function ThemeCheckBox (props) {
    const [toggleCheckBox, setToggleCheckBox] = React.useState(false)
    const { name, rules, defaultValue} = props
    const formContext = useFormContext();
    const { control,errors } = formContext;
    const { field } = useController({
        name,
        control,
        rules,
        defaultValue
     })
    const [IOStoggleCheckBox, setIOStoggleCheckBox] = React.useState(false)
    return(
        <View style={{flexDirection:'row',alignItems:'center'}}>
            {
                Platform.OS == "ios" ?
                    <CheckBoxIOS
                        checkedColor="#CB587F"
                        checked={IOStoggleCheckBox}
                        onPress={() =>{
                            let value = !IOStoggleCheckBox;
                            if (props.hooks) {
                                setIOStoggleCheckBox(value)
                                props.sethookValue(props.name, value);
                            }else{
                                props.onValueChange(newValue);
                            }

                        }}
                        {...props.CheckBoxProps}
                    />
                :
                    <CheckBox

                        disabled={false}
                        value={toggleCheckBox}
                        onValueChange={(newValue) => {
                            if (props.hooks) {
                                setToggleCheckBox(newValue);
                                props.sethookValue(props.name, newValue);
                            }
                            else {
                                props.onValueChange(newValue);
                            }
                        }}
                        {...props.CheckBoxProps}
                    />
            }

            <Text {...props.LabelProps}>{props.label.label > 0 ? props.label : props.label}</Text>

        </View>

    )
}
