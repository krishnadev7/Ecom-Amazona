import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null,
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'Cart_Add_Item':
      const newItem = action.payload;
      const exitItem = state.cart.cartItems.find(
        item => item._id === newItem._id
      );
      const cartItems = exitItem
        ? state.cart.cartItems.map(item =>
            item._id === exitItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'Remove_Cart_Item': {
      const cartItems = state.cart.cartItems.filter(
        item => item._id !== action.payload._id
      );
      localStorage.removeItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "User_SignIn":
      return {...state, userInfo: action.payload}
    
    case "User_SignOut": 
    return {...state, userInfo: null}
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
