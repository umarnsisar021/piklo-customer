
import * as React from 'react';


import { connect } from 'react-redux';



const  ScreenWrapper = (props) =>{
    React.useEffect(() => {
       
    }, [])

    return ( props.children )
}
const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        //setDeviceId: (data) => dispatch({ type: 'SET_DEVICE_ID', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user } = state
    return { user: user, userData: user.userDetails}
}
export default connect(mapStateToProps, mapDispatchToProps)(ScreenWrapper)


