const initialState = {
    signUp_basic: {},
}

const signUpReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SIGNUP_BASIC':
            return { ...state, signUp_basic: action.payload }
        case 'SET_SIGNUP_STEP_1':
            return { ...state, step_1: action.payload }
        case 'SET_SIGNUP_STEP_2':
            return { ...state, step_2: action.payload }
        case 'SET_SIGNUP_STEP_3':
            return { ...state, step_3: action.payload }
        case 'SET_SIGNUP_STEP_4':
            return { ...state, step_4: action.payload }
    }
    return state;
}



export default signUpReducer;