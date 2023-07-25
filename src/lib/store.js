// Setup redux store here
import { configureStore } from '@reduxjs/toolkit';
import questionaireReducer from './userSlice';
import dontShowReducer from "./dontShow"
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig={
  key:"root",
  version:1,
  storage,
}

const reducer=combineReducers({
  questionaire:questionaireReducer,
  dontShow:dontShowReducer
})

const persistedReducer=persistReducer(persistConfig,reducer)


const store = configureStore({
  reducer:persistedReducer,
  middleware:  (getDefaultMiddleware)=> getDefaultMiddleware({
        
    serializableCheck: false,
  }),
  // You can add additional middleware here if needed
 
});

export default store;