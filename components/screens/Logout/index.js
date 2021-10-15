
import * as React from 'react';
import { Text, TouchableOpacity, View, StatusBar , Dimensions} from 'react-native';
import Toast from 'react-native-root-toast';
import useJwt from '../../util/util'
import { connect } from 'react-redux';
import ScreenLoader from '../component/ScreenLoader';

function Logout (props){
 
  React.useEffect(()=>{
        useJwt.storeData(null)
        props.setLogin(false)
        ///props.navigation.navigate('Auth');  

  },[])
  return(

    <ScreenLoader />
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Logout)