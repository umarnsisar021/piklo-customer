import * as React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { CommonActions  } from '@react-navigation/native';
import ScreenLoader from '../screens/component/ScreenLoader';

 function Auth (props){
     
    const userConfig = useSelector(state => state.user);
    React.useEffect(()=>{
        setTimeout(() => {
            if (userConfig.isLogin === false) {
                const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Login' },
                    ],
                })
                props.navigation.navigate('Login');


            } else {
                const resetAction = CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Home' },

                    ],
                })
                props.navigation.navigate('Home');
               // props.navigation.dispatch(resetAction);

            }

        }, 0);

    }, [userConfig.isLogin])

    return(
        <ScreenLoader />
      )
  }


const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setDeviceId: (data) => dispatch({ type: 'SET_DEVICE_ID', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user } = state
    return { user: user, userData: user.userDetails }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth)

