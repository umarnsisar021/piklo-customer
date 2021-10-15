import * as React from 'react';
import { Text, ScrollView, ImageBackground, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useForm} from "react-hook-form";
// Theme Elements
import theme from '../../theme/style'
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import useJwt from '../../util/util'
import ScreenLoader from '../component/ScreenLoader';
import menu_shade from '../../../assets/app/menu-shade.png';
import EditableText from 'react-native-inline-edit';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-root-toast';
import * as ImagePicker from 'expo-image-picker';

const style = StyleSheet.create({
    container:{
        paddingHorizontal:30,
    },
    fieldContainer:{
        marginTop:20
    },
    label:{
        textTransform:'uppercase',
        color:"gray",
        fontFamily:'Barlow_SemiBold',
        fontSize: 12,
    },
    valueContainer: {
        paddingVertical:10,
        borderBottomWidth:1,
        borderBottomColor:"#dfe1e5",
    },
    value: {
        fontSize: 16,
        color: "#5b656d",
    },
    profile_heading:{
        fontSize:32,
        color:'white',
        fontFamily:"Barlow_Bold"
    },
    profile_img_btn:{
        position: 'absolute',
        bottom: 0,
        left: 50,
        backgroundColor: '#449284',
        borderRadius: 50,
        padding: 2,
    }
})



function Profile(props) {
    const navigation = useNavigation();
    const scrollViewRef = React.useRef();
    const formMethods = useForm();
    const [data,setData] = React.useState({
        total_delivers: 0,
        total_opportunities: 0,
        recent_jobs: [],
    });
    const [loaded, setLoaded] = React.useState(true);
    // To Render the Editable field
    const FieldComponent = ({ label, value, name, secureTextEntry, isTextEditable }) => {
        const [text, setText] = React.useState(value)
        /// Trigger the update
        const onChangeValue = (v) => {
            let storeValue = props.userProfile;
            setText(v)
            updateField(name, v)
            storeValue[name] = v;
            props.setUserProfile(storeValue);
        }
        return <View style={[style.fieldContainer]}>
                    <Text style={[style.label]}>{label}</Text>
                    <View style={[style.valueContainer]}>
                        <EditableText
                            text={text ? text: ""}
                            sendText={(v) => { onChangeValue(v) }}
                            isTextEditable={isTextEditable}
                            textProps={{ style: [style.value] }}
                            textInputProps={{ style: [style.value], secureTextEntry: secureTextEntry }}
                        />
                    </View>
                </View>
    }

    const SelectFieldComponent = ({ label, value, name, items, isTextEditable }) => {
        const [text, setText] = React.useState(value)
        const [open, setOpen] = React.useState(false);
        const onChangeValue = (value) => {

            let storeValue = props.userProfile;
            updateField(name, value())
            storeValue[name] =  value();
            props.setUserProfile('');
            props.setUserProfile(storeValue);

        }

        return <View style={[style.fieldContainer]}>
            <Text style={[style.label]}>{label}</Text>
            <View style={[style.valueContainer]}>
                <DropDownPicker
                    listMode="MODAL"
                    theme="LIGHT"
                    style={{ paddingVertical: 5 }}
                    value={text}
                    defaultValue={value}
                    open={open}
                    items={items}
                    setOpen={setOpen}
                    setValue={onChangeValue}
                    containerStyle={{ width: '100%', padding: 0, margin: 0 }}
                    style={{ backgroundColor: "transparent", padding: 0, height: 25, borderRadius: 0, borderWidth: 0, width: '100%', margin: 0, paddingHorizontal: 0 }}
                    textStyle={[style.value, { padding: 0, margin: 0 }]}
                    labelStyle={{
                        padding: 0, margin: 0
                    }}
                />
            </View>
        </View>
    }

     // To hit update api
    const updateField = async (field, value) => {
        useJwt.post("drivers/settings/update", { key_name: field, value: value }).then((res) => {
            if (res.data.status) {
                Toast.show("Updated Successfully.")
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    // To Update Profile Image
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
            base64: true
        });



        if (!result.cancelled) {
            useJwt.post("drivers/settings/change_avatar", { path: 'data:image/png;base64,' + result.base64 }).then((res) => {
                if (res.data) {
                    props.updateAvatar(res.data.file_path)
                    Toast.show('Profile successfully updated.', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        visible: true,
                        backgroundColor: '#31a550',
                        textColor: '#fff',
                    })
                }
            }).catch((error) => {

            })
        }
    };
    React.useEffect(()=>{

    },[])
    if(loaded){
        return (

            <View id='Main-page' colors={['#FFFFFF', '#FFFFFF']} style={{}} >
                <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    bounces={false}
                   // onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >

                   <View style={{...theme.bg_purple,height:250,justifyContent:'center',position:"relative"}}>

                        <ImageBackground source={menu_shade} resizeMode="stretch" style={{flex: 1,
                            justifyContent: "center",paddingHorizontal:25}} >
                                <TouchableOpacity
                                    onPress={() => { props.navigation.goBack() }}
                                    style={{ alignSelf: 'flex-start',top: -10, }}
                                >
                                    <Icon type="feather" name={"chevrons-left"} color="white" />
                                </TouchableOpacity>
                                <View
                                    style={{ alignSelf: 'flex-start' }}
                                >
                                    <Text style={[style.profile_heading]}>Edit yourself</Text>
                                </View>
                                <View style={[theme.mt_20]}>
                                    <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={props.userProfile.avatar_path ? { uri: useJwt.getBaseUrl() + props.userProfile.avatar_path } : profile} />
                                    <TouchableOpacity onPress={() => pickImage()} style={[style.profile_img_btn]}>
                                    <Icon type="feather" name="plus" color="white" size={18} style={{}} />
                                    </TouchableOpacity>

                                </View>
                        </ImageBackground>
                    </View>

                    <View style={[style.container]}>
                        <FieldComponent label="First Name" name="first_name" value={props.userProfile.first_name}  />
                        <FieldComponent label="Last Name" name="last_name" value={props.userProfile.last_name} />
                        <FieldComponent label="Username" name="username" value={props.userProfile.username} isTextEditable={false} />
                        <FieldComponent label="Your Email" name="email" value={props.userProfile.email} />
                        <FieldComponent label="Mobile No" name="mobile_no" value={props.userProfile.mobile_no} />
                        <SelectFieldComponent label="Gender" name="gender" value={props.userProfile.gender} items={[
                            {label: "Male", value:"male"},
                            {label:"Female",value:"female"}
                        ]} />
                        <FieldComponent label="Address" name="address" value={props.userProfile.address} />
                    </View>

                </ScrollView>
            </View>
        )
    }
    else{
        return <ScreenLoader />
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setUserProfile: (data) => dispatch({ type: 'SET_USER_PROFILE', payload: data }),
        updateAvatar: (data) => dispatch({ type: "UPDATE_USER_AVATAR", payload: data })
    }
}
const mapStateToProps = (state) => {
    const { user } = state
    return { user: user, userData: user.userDetails, userProfile: user.userProfile}
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)


