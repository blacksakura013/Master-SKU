import {
    ACTION_ACT_UTQ,
 
  } from '../Constants'
  const initialState = {
      UTQ: [],
      
    }
    
    const activeReducerUTQ = (state = initialState, {type, payload}) => {
      switch (type) {
        case ACTION_ACT_UTQ:
          return {...state, UTQ: payload};
 
        default:
          return state;
      }
    };
    export default activeReducerUTQ;