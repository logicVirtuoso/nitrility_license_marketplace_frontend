import { INIT_MATIC_PRICE, SET_MATIC_PRICE } from '../../actions/actionTypes'

// src/redux/reducers.js
const initialState = {
  tokenPrice: 0,
}

export const priceReducer = (
  state = initialState,
  action = { type: INIT_MATIC_PRICE, payload: { tokenPrice: 0 } },
) => {
  switch (action.type) {
    case INIT_MATIC_PRICE:
    case SET_MATIC_PRICE:
      return {
        ...state,
        tokenPrice: action.payload.tokenPrice,
      }
    default:
      return state
  }
}
