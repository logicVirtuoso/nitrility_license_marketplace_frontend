import { combineReducers } from 'redux'

import authorization from './authorizationReducer'
import { priceReducer } from './tokenPrice'

const rootReducer = combineReducers({
  authorization,
  priceReducer,
})

export default rootReducer
