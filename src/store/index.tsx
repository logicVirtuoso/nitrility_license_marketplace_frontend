// import { createStore, applyMiddleware } from 'redux'
// import thunkMiddleware from 'redux-thunk'
// import { createLogger } from 'redux-logger'
// import rootReducer from './reducers'

// const loggerMiddleware = createLogger()

// export const store = createStore(
//     rootReducer,
//     applyMiddleware(thunkMiddleware, loggerMiddleware),
// )

// third-party
import { configureStore } from '@reduxjs/toolkit'
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux'
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

// project import
import reducers from './reducers'

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persister = persistStore(store)

const { dispatch } = store

const useDispatch = () => useAppDispatch()
const useSelector = useAppSelector

export { store, dispatch, persister, useSelector, useDispatch }
