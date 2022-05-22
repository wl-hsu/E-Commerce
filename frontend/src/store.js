import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productListReducer,
  productDeatilsReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDeatilsReducer,
  cart: cartReducer,
})

//Get locally stored shopping cart information
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

//initialize state value
const initialState = {
  cart: { cartItems: cartItemsFromStorage },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store