import React, { useContext, useRef, useState } from 'react';


const index =() =>{

}
export function validate(value,_type) {
    if(value !== '' ){
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (_type == 'email') {
            reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        }

        if (reg.test(value) === false) {
            return false;
        }
        else {
            return true;
        }
    }
    
}
export default index;
