import React, { useEffect,createRef } from "react";
import { View ,TextInput} from "react-native";
import { cos, Value } from "react-native-reanimated";

export default function OTPFiller(props) {
    let elem = [];
    const inputs = props.inputLength;
    const inputRef = React.useRef([]);   
    for (let i=0; i < inputs; i++){
        elem[i]= i;
    }
    const handleOnChnageText = (value,key)=>{
        inputRef.current[key].value = value;
        if(value.length > 0){
            if(key < inputs-1){
                inputRef.current[key+1].focus();
            }
        }
        else {
            if(key !== 0){
                inputRef.current[key-1].focus();
            }
        }
        let revalue='';
        for (let i=0; i < inputs; i++){
            if(inputRef.current[i].value){
                revalue = revalue + inputRef.current[i].value
            }
        }
        props.callback(revalue);
    }
    const handleOnKeyPress = (nativeEvent,key)=>{
        if (nativeEvent.key === 'Backspace') {
            if(key === 0 ){
            }
            else{
                if(inputRef.current[key].value === ''){
                    inputRef.current[key-1].focus();
                    inputRef.current[key-1].clear();
                    inputRef.current[key-1].value = '';
                    
                }
            }
        }
    }
    const handleOnFocus = (key)=>{
        let value= inputRef.current[key].value;
        if(key < inputs-1){
            if(value){
                if(value.length > 0 ){
                    inputRef.current[key+1].focus();
                }
            }
            
        }
    }

    return(
        <View style={{width:'100%',flexDirection:"row",justifyContent:'space-evenly' ,...props.containerStyle}}>
           {elem.map((elem,key)=>(
                <TextInput 
                    caretHidden={true} 
                    autoFocus={true}
                    key={key} 
                    ref={(element) => {inputRef.current[key] = element;}} maxLength={1} 
                    style={{borderColor:'gray',borderBottomWidth:2,...props.inputStyle}} 
                    keyboardType = 'numeric'
                    onChangeText={(value)=>{handleOnChnageText(value,key)}} 
                    onKeyPress={({ nativeEvent }) => {handleOnKeyPress(nativeEvent,key)}}
                    onFocus={ ()=>{ (handleOnFocus(key)) }}
                />
           ))}
           
           
        </View>
    )
}