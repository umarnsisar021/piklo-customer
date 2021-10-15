import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import {connect, useSelector} from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerContentScrollView, DrawerItemList,DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';

import DrawerContent from './DrawerContent';
import ScreenWrapper from '../screens/ScreenWrapper';
/// SCREENS
import SplashScreen from '../screens/SplashScreen/index';
import Auth from '../util/auth';
import Login from '../screens/login';
import Logout from '../screens/Logout';
import SignUp from '../screens/signup';
import SignUpMessage from '../screens/signup/signupmessage';
import ForgotPassword from '../screens/login/forgotpassword';
import VerifyMobile from '../screens/login/verifymobile';
import ChangePassword from '../screens/login/changepassword';
import ChangePasswordMessage from '../screens/login/changepasswordMessage';
import DriverRegistration from '../screens/DriverRegistration';
import Personalnformation from '../screens/DriverRegistration/Personalnformation';
import IdentityAndDocuments from '../screens/DriverRegistration/IdentityAndDocuments';
import VehicleInformation from '../screens/DriverRegistration/VehicleInformation';
import BankInformation from '../screens/DriverRegistration/BankInformation';
import Terms from '../screens/DriverRegistration/Terms';
import RegistrationMessage from '../screens/DriverRegistration/RegistrationMessage';
import JobInformation from '../screens/Job/JobInformation';
import JobCompleted from '../screens/Job/JobCompleted';
import OngoingJob from '../screens/Job/OngoingJob';
import OrderHistory from '../screens/OrderHistory';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
/// Home Tabs
import HomeTabs from './HomeTab'
import OrderHistoryTab from './OrderHistoryTab'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements/dist/icons/Icon';

// Images


const HeaderTheme={
  headerStyle: { backgroundColor: '#CB587F'},
  headerTitleStyle:{
    color:"white",

  },
  headerBackTitleStyle:{
    color:"white"
  },
  headerTintColor :"white",
  headerBackTitleVisible: false,
  headerBackImage:
    ({ navigation }) =>
    (<View style={{marginLeft: 20}}>
      <Icon
        type="feather"
        name={"chevrons-left"}
        color="white" />
    </View>
    )
}
const HeaderThemeSecondary = {
  headerStyle: { backgroundColor: '#CB587F' },
  headerTitleStyle: {
    color: "white",

  },
  headerBackTitleStyle: {
    color: "white"
  },
  headerTintColor: "white",
  headerBackTitleVisible: false,
  headerBackImage:
    ({ navigation }) =>
    (<View style={{ marginLeft: 20 }}>
      <Icon
        type="feather"
        name={"chevrons-left"}
        color="white" />
    </View>
    )
}
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = (props)=>(
  <Stack.Navigator>
    {/* <Stack.Screen options={{ headerShown: true, title: "Job Completed", ...HeaderTheme }} name="JobCompleted" >
      {props => <ScreenWrapper {...props}><JobCompleted {...props} /></ScreenWrapper>}
    </Stack.Screen> */}
    <Stack.Screen options={{headerShown: false}} name="Auth">
      {props => <ScreenWrapper {...props}><Auth {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false, ...HeaderTheme}} name="Home">
      {props => <ScreenWrapper {...props}><HomeTabs {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false, ...HeaderTheme }} name="Profile">
      {props => <ScreenWrapper {...props}><Profile {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="DriverRegistration" >
      {props => <ScreenWrapper {...props}><DriverRegistration {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{headerShown: false}}  name="SignUp" >
      {props => <ScreenWrapper {...props}><SignUp {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="VerifyMobile"       >
      {props => <ScreenWrapper {...props}><VerifyMobile {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}


    {/*  */}
    <Stack.Screen options={{ headerShown: false ,title:"Job Information",...HeaderTheme}} name="JobInformation" >
      {props => <ScreenWrapper {...props}><JobInformation {...props} /></ScreenWrapper>}
    </Stack.Screen>

    {/*  */}
    <Stack.Screen options={{ headerShown: true ,title:"Job Completed",...HeaderTheme}} name="JobCompleted" >
      {props => <ScreenWrapper {...props}><JobCompleted {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false , title:"Ongoing Job",...HeaderTheme }} name="OngoingJob" >
      {props => <ScreenWrapper {...props}><OngoingJob {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false,title: 'Order History',...HeaderTheme}} name="OrderHistory">
      {props => <ScreenWrapper {...props}><OrderHistoryTab {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}

    <Stack.Screen options={{headerShown: false}} name="Login">
      {props => <ScreenWrapper {...props}><Login {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{headerShown: false}} name="Logout">
      {props => <ScreenWrapper {...props}><Logout {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="ChangePassword">
      {props => <ScreenWrapper {...props}><ChangePassword {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="ForgotPassword">
      {props => <ScreenWrapper {...props}><ForgotPassword {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="ChangePasswordMessage" >
      {props => <ScreenWrapper {...props}><ChangePasswordMessage {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="SignUpMessage" >
      {props => <ScreenWrapper {...props}><SignUpMessage {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="Personalnformation" >
      {props => <ScreenWrapper {...props}><Personalnformation {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="IdentityAndDocuments">
      {props => <ScreenWrapper {...props}><IdentityAndDocuments {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="VehicleInformation">
      {props => <ScreenWrapper {...props}><VehicleInformation {...props} /></ScreenWrapper>}
    </Stack.Screen>
    {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="BankInformation">
      {props => <ScreenWrapper {...props}><BankInformation {...props} /></ScreenWrapper>}
    </Stack.Screen>
     {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="Terms" >
      {props => <ScreenWrapper {...props}><Terms {...props} /></ScreenWrapper>}
    </Stack.Screen>
      {/*  */}
    <Stack.Screen options={{ headerShown: false }} name="RegistrationMessage" >
        {props => <ScreenWrapper {...props}><RegistrationMessage {...props} /></ScreenWrapper>}
    </Stack.Screen>
    <Stack.Screen options={{ headerShown: false,...HeaderTheme }} name="Notifications" >
      {props => <ScreenWrapper {...props}><Notifications {...props} /></ScreenWrapper>}
    </Stack.Screen>

  </Stack.Navigator>
  );



function Navigation (reduxProps) {
    return reduxProps.user.isLogin ?
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Auth" drawerContent={(props) => <DrawerContent {...props} /> }>
              <Drawer.Screen options={{headerShown:false}} name="HomeStack"  component={HomeStack } />
            </Drawer.Navigator>

        </NavigationContainer>
        :
        <NavigationContainer>
          <HomeStack />
        </NavigationContainer>


}

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    setUserData: (data) => dispatch({ type: 'SET_USER_DETAILS', payload: data }),
    setUserId: (data) => dispatch({ type: 'SET_USER_ID', payload: data }),
    setLogin: (data) => dispatch({ type: 'SET_LOGIN', payload: data }),
    setToken: (data) => dispatch({ type: 'SET_TOKEN', payload: data }),
  }
}
const mapStateToProps = (state) => {
  const { user } = state
  return { user: user }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navigation)