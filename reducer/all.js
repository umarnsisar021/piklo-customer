const initialState = {
    cart:[],
    net_total_discount:0,
    net_total_tax:0,
    service_charges:0,
    net_total:0,
    vendor_id : null,
    current_location : null,

}
const initialUser = {
    userID:null,
    userDetails:{},
    userProfile:{},
    isLogin:false,
    otp:false,
    token:null,
    device_id : null,
    location : {},
    heading : 0,
    loginCredentials: {}
}


const initialExtra = {
    ChoicesRequiredRecall:{},
    ChoicesRequired:{},
    SelectedChoiceGroup:{},
    SelectedVariation:{}
}
const cartItems = (state =initialState,action)=>{
    switch (action.type){
        case 'SET_VENDOR':
            return {...state, vendor_id: action.payload}
        case 'ADD_TO_CART':
            return {...state, cart: [...state.cart, action.payload]}
        case 'REMOVE_ITEM' :
            let _cart = state.cart;
            _cart = _cart.filter(function(item,i) {

                return i !== action.index
            })

            return{...state, cart: [..._cart]}
        case 'REMOVE_ALL' :
            return {...state, cart: []}

        case 'ITEM_QTY_UP' :
        let temp_array = state.cart;
        const index = action.payload
        temp_array[index]['qty'] =  temp_array[index]['qty']+1;
        return{...state, cart: [...temp_array]}

        case 'ITEM_QTY_DOWN' :
        let _temp_array = state.cart;
        _temp_array.map((item,i) =>{
            if(i === action.index){
                _temp_array[i]['qty'] =  _temp_array[i]['qty']-1;
            }
        })
        return{...state, cart: [..._temp_array]}


    }
    return state;
}

export const currentLocation = (state =initialState,action)=>{
    switch (action.type){
        case 'SET_CURRENT_LOCATION':
            return {...state, current_location: action.payload}

    }
    return state;
}
export const userConfig= (state =initialUser,action)=>{
    switch (action.type){
        case 'SET_OTP':
            return {...state, otp: action.payload}
        case 'SET_LOGIN':
            return {...state, isLogin: action.payload}
        case 'SET_USER_ID':
            return {...state, userID: action.payload}
        case 'SET_USER_DETAILS':
            return {...state, userDetails: action.payload}
        case 'SET_USER_PROFILE':
            return {...state, userProfile: action.payload}
        case 'UPDATE_USER_AVATAR':
            let data = state.userProfile;
            data.avatar_path = action.payload;
            return { ...state, userProfile: data }
        case 'SET_TOKEN':
            return { ...state, token: action.payload }
        case 'SET_DEVICE_ID':
            return { ...state, device_id: action.payload }
        case 'SET_LOCATION':
            return { ...state, location: action.payload }
        case 'SET_HEADING':
            return { ...state, heading: action.payload }
        case 'SET_LOGIN_CREDENTIALS':
            return { ...state, loginCredentials: action.payload }


    }
    return state;
}


export const extra = (state =initialExtra,action)=>{
    switch (action.type){
        case 'SET_VARIATION':
            return {...state, SelectedVariation: action.payload}
        case 'SET_CHOICES_REQUIRED':
            return {...state, ChoicesRequired : action.payload}
        case 'SET_CHOICES_REQUIRED_RECALL':
            return {...state, ChoicesRequiredRecall : action.payload}
        case 'UPDATE_SELECTED_CHOICE_GROUP':
            return {...state,SelectedChoiceGroup : action.payload}
    }
    return state;
}

export function  Handlechange(state =false,action){
    switch (action.type){
        case 'item/modal/change_ws':
            return !state
    }
    return state;
}


export function ItemModal(state ={item_data:{}},action){
    switch (action.type){
        case 'SET_ITEM_MODAL_DATA':
        return {...state, item_data : action.payload}

    }
    return state;
}

export default cartItems;