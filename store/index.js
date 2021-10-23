import {createStore,applyMiddleware ,combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage  from '@react-native-async-storage/async-storage'

import thunk from 'redux-thunk';
import cartItems, { currentLocation, userConfig, Handlechange, extra, ItemModal, jobRequestFormData } from '../reducer/all';
import appData from '../reducer/appData';
import signupReducer from '../reducer/signupReducer';
import ongoingJobReducer from '../reducer/ongoingJobReducer';
const persistConfig = {
    timeout:100,
    key: 'root',
    storage:AsyncStorage,
  }

//const persistedReducer = persistReducer(persistConfig, cartItems)

const rootReducer = combineReducers({
    appData: persistReducer(persistConfig, appData),
    cartReducer: persistReducer(persistConfig, cartItems),
    locationReducer:  persistReducer(persistConfig, currentLocation),
    onGoingJob: persistReducer(persistConfig, ongoingJobReducer),
    signup: signupReducer,
    user:  persistReducer(persistConfig, userConfig),
    extraReducer:extra,
    itemModalReducer: ItemModal,
    jobRequestFormData: jobRequestFormData,

});

export default () => {
    let store = createStore(rootReducer)
    let persistor = persistStore(store);
    return { store, persistor }
  }
//export default store = createStore(cartItems);