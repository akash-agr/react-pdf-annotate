import { configureStore, getDefaultMiddleware, combineReducers } from "@reduxjs/toolkit"

// import SearchEngineReducer from "../features/SearchEngineSlice"
// import NewsReducer from "../features/NewsSlice"
import SharePDF from "../features/SharePDFSlice"
// import AlertSystem from "../features/AlertSystemSlice"
// import HighLevel from "../features/HighLevelSlice"
// import Concall from "../features/ConcallSlice"

const store = configureStore({
    reducer: combineReducers({
      // searchEngine: SearchEngineReducer,
      // news: NewsReducer,
      sharePDF: SharePDF,
      // alertSystem: AlertSystem, 
      // highLevel: HighLevel,
      // concall: Concall
    }),
    // middleware: getDefaultMiddleware(), // this is redundant and for demonstration only
    
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
    devTools: true // this is redundant and for demonstration only
    //preloadedState: {your state object for initialization or rehydration}
  })

export default store 