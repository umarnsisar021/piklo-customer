const initialState = {
    jobCategories:{},
}

export const appData = (state = initialState,action)=>{
    switch (action.type){
        case 'SET_JOB_CATEGORIES':
            return { ...state, jobCategories: action.payload}
    }
    return state;
}


export default appData;