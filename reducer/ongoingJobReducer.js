const initialState = {
    id : "",
    pickups: {},
    dropoffs: {},
    current_location:{},
    current_location_id:"",
    location_distance:"0",
    location_duration:"0"
}

const ongoingJobReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ONGOING_JOB_ID':
            return { ...state, id: action.payload }
        case 'SET_PICKUPS':
            return { ...state, pickups: action.payload }
        case 'SET_DROPOFFS':
            return { ...state, dropoffs: action.payload }
        case 'SET_JOB_CURRENT_LOCATION':
            return { ...state, current_location: action.payload }
        case 'SET_LOCATION_ID':
            return { ...state, current_location_id: action.payload }
        case 'SET_LOCATION_DISTANCE':
            return { ...state, location_distance: action.payload }
        case 'SET_LOCATION_DURATION':
            return { ...state, location_duration: action.payload }

    }
    return state;
}



export default ongoingJobReducer;