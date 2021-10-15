import * as React from 'react';

import { connect, useDispatch, useSelector } from 'react-redux';
export default function Logout ({ navigation }){
    const dispatch = useDispatch();
    const userConfig = useSelector(state => state.customerReducer);
    React.useEffect(()=>{
        
        if(userConfig.isLogin === true){
            dispatch({ type: 'SET_LOGIN', payload: false});
        }
       
    },[])
   
    return(
        <>
        
        </>
      )
  }
