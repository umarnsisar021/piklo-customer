import React from 'react';
import { View, ImageBackground, Image,  Text, ScrollView, StyleSheet} from 'react-native';
import {connect, useSelector} from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import {  createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import theme from '../theme/style'
import useJwt from '../util/util'
import * as ImagePicker from 'expo-image-picker';
/// SCREENS



// Images
import Avatar from '../../assets/icon.png';
import menu_shade from '../../assets/app/menu-shade.png';
import profile from '../../assets/app/profile.png';
import { TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-root-toast';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerContent = (props) => {
  const store  = useSelector(state => state.userReducer);
  const navigation = props.navigation;
  const DrawrItemComponent = (props) =>{
    const [ItemPressed,setItemPressed] = React.useState(false);
    return(
    <TouchableOpacity onPress={()=>navigation.navigate(props.screen)} onPressIn={()=>{setItemPressed(true)}} onPressOut={()=>{setItemPressed(false)}} style={{paddingHorizontal:20}} >
        <View style={{ backgroundColor: ItemPressed ? 'aliceblue ' : 'white', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', borderBottomWidth: 1, borderBottomColor:'#E9E8E8'}}>
          <Text style={{ color:'#7B7B7B'}}>{props.title}</Text>
      </View>
      </TouchableOpacity>
    )
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true
    });



    if (!result.cancelled) {
      useJwt.post("drivers/settings/change_avatar", { path: 'data:image/png;base64,' + result.base64}).then((res)=>{
        if(res.data){
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
      }).catch((error)=>{

      })
    }
  };
  return(
    <>
    <View>

        <View style={{...theme.bg_purple,height:230,justifyContent:'center',position:"relative"}}>
          <ImageBackground source={menu_shade} resizeMode="stretch" style={{flex: 1,
            justifyContent: "center",paddingHorizontal:25}} >
            <View style={{}}>

            </View>
            <View >
              <View>

                <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={props.userProfile.avatar_path ? { uri: useJwt.getBaseUrl() + props.userProfile.avatar_path } : profile} />
                <TouchableOpacity onPress={() => pickImage()} style={{ position: 'absolute', bottom: 0, left: 50, backgroundColor:'#449284',borderRadius:50,padding: 2,}}>
                  <Icon type="feather" name="plus" color="white" size={18} style={{}} />
                </TouchableOpacity>

              </View>

              <Text style={{ marginTop: 10, color: 'white', fontSize: 22, fontWeight: '500', textTransform:'capitalize'}}>
               {props.userProfile.first_name +" "+ props.userProfile.last_name}
              </Text>
            </View>
          </ImageBackground>
      </View>
    </View>
      <ScrollView style={{ marginTop: 20,}} contentContainerStyle={{ flexGrow: 1 }} >
        <DrawrItemComponent screen="Home" title="Dashboard" iconName="home-outline" iconFamily="ionicon"/>
        <DrawrItemComponent screen="Notifications" title="Notifications" iconName="cart-outline" iconFamily="ionicon"/>
        <DrawrItemComponent screen="OrderHistory" title="My Tasks" iconName="log-out-outline" iconFamily="ionicon"/>
        <DrawrItemComponent screen="Profile" title="My Profile" iconName="log-out-outline" iconFamily="ionicon"/>
        <DrawrItemComponent screen="Home" title="Address Book" iconName="log-out-outline" iconFamily="ionicon"/>
        <DrawrItemComponent screen="Logout" title="Logout" iconName="log-out-outline" iconFamily="ionicon"/>

        <View style={{position:'absolute',bottom: 20,paddingHorizontal:20}}>
            <View style={{...theme.row}}>
              <Icon type="ionicon" name="chatbox-ellipses-outline" size={30}  color={theme.gray.color}/>
            <Text style={{ ...theme.f_18, ...theme.pl_5, fontWeight: '700', ...theme.gray}}>Support</Text>
            </View>
          <Text style={{ ...theme.gray}}>v1.0 clickcommerce.biz</Text>
        </View>
    </ScrollView>
    </>

  )
}
const mapDispatchToProps= (dispatch)=>{
    return {
      updateAvatar: (data) => dispatch({ type: "UPDATE_USER_AVATAR",  payload: data })
    }
}
const mapStateToProps = (state) => {
  const { user } = state
  return { user: user, userData: user.userDetails ,userProfile : user.userProfile}
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent)