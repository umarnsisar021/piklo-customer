import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import {Provider,useDispatch,useSelector} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store';
const {store, persistor} = configureStore();
import { RootSiblingParent } from 'react-native-root-siblings';
import Theme from './components/index';
import * as Font from 'expo-font';
import LocationUpdate from './components/util/LocationUpdate';
import SplashScreen from './components/screens/SplashScreen';
import { StatusBar } from 'expo-status-bar';
/// Notification Library
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
LogBox.ignoreLogs([
  'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.',
]);
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead', // TODO: Remove when fixed
])
Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
  }),
});
export default function App() {

  const [loaded,setLoaded] = React.useState(false)

  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const loadFonts = async () =>{
    await Font.loadAsync({
      // Load a fonts from a static resource
      AntDesign: require('./assets/fonts/AntDesign.ttf'),
      Entypo: require('./assets/fonts/Entypo.ttf'),
      EvilIcons: require('./assets/fonts/EvilIcons.ttf'),
      Feather: require('./assets/fonts/Feather.ttf'),
      FontAwesome: require('./assets/fonts/FontAwesome.ttf'),
      FontAwesome5_Brands: require('./assets/fonts/FontAwesome5_Brands.ttf'),
      FontAwesome5_Regular: require('./assets/fonts/FontAwesome5_Regular.ttf'),
      FontAwesome5_Solid: require('./assets/fonts/FontAwesome5_Solid.ttf'),
      Fontisto: require('./assets/fonts/Fontisto.ttf'),
      Foundation: require('./assets/fonts/Foundation.ttf'),
      Ionicons: require('./assets/fonts/Ionicons.ttf'),
      MaterialCommunityIcons: require('./assets/fonts/MaterialCommunityIcons.ttf'),
      MaterialIcons: require('./assets/fonts/MaterialIcons.ttf'),
      Octicons: require('./assets/fonts/Octicons.ttf'),
      SimpleLineIcons: require('./assets/fonts/SimpleLineIcons.ttf'),
      Zocial: require('./assets/fonts/Zocial.ttf'),
      FredokaOne: require('./assets/fonts/FredokaOne/FredokaOne-Regular.ttf'),
      // Barlow
      Barlow_Medium: require('./assets/fonts/barlow/Barlow-Medium.ttf'),
      Barlow_Regular: require('./assets/fonts/barlow/Barlow-Regular.ttf'),
      Barlow_SemiBold: require('./assets/fonts/barlow/Barlow-SemiBold.ttf'),
      Barlow_Bold: require('./assets/fonts/barlow/Barlow-Bold.ttf'),
      Barlow_ExtraBold: require('./assets/fonts/barlow/Barlow-ExtraBold.ttf')
    });
     setTimeout(()=>{
      setLoaded(true);
    },3000)

  }
  useEffect(()=>{


        const handleNotification = ({ origin, data }) => {
          // console.log(
          //     `Push notification ${origin} with data: ${JSON.stringify(data)}`,
          // );
        };
        const subscription = Notifications.addPushTokenListener(handleNotification);

        registerForPushNotificationsAsync().then(token => {
          token = token.replace("ExponentPushToken[", "");
          token = token.replace("]", "");
          store.dispatch({ type: 'SET_DEVICE_ID', payload: token })
          //props.setDeviceId(token);
          //setExpoPushToken(token)
        }
        );

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

          let { data } = response.notification.request.content;
          // New Job Notification
          if (data.to_screen == "JobInformation") {
              props.navigation.navigate(data.to_screen, {id: data.primary_id  })
          }

        });
        return () => {

          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };

  },[])
  loadFonts();

  if (loaded) {
    return (
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          <RootSiblingParent>
            <StatusBar backgroundColor="transparent" />
            <Theme />
            {/* <LocationUpdate /> */}
          </RootSiblingParent>
        </PersistGate>
      </Provider>

    );
  }else{
    return <SplashScreen></SplashScreen>
  }

}



async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
      content: {
          title: "You've got mail! 📬",
          body: 'Here is the notification body',
          data: { data: 'goes here' },
          sound: '../../../assets/sounds/notification.mp3'
      },
      trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
      }
      if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
  } else {
      alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
      });
  }

  return token;
}