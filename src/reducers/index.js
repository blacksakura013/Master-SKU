// Imports: Dependencies
import {combineReducers} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
// Imports: Reducers
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import redeemReducer from './redeemReducer';
import promotionReducer from './promotionReducer';
import activityReducer from './activityReducer';
import notiReducer from './notiReducer';
import contactUsReducer from './contactUsReducer';
import interestReducer from './interestReducer';
import signoutReducer from './signoutReducer';
import campaignReducer from './campaignReducer';
import databaseReducer from './databaseReducer';
import productReducer from './productReducer';
import activeReducerUTQ from './activeReducerUTQ';
// Redux: Root Reducer
const appReducer = combineReducers({
  activityReducer: activityReducer,
  contactUsReducer: contactUsReducer,
  interestReducer: interestReducer,
  loginReducer: loginReducer,
  notiReducer: notiReducer,
  redeemReducer: redeemReducer,
  promotionReducer: promotionReducer,
  registerReducer: registerReducer,
  signoutReducer: signoutReducer,
  campaignReducer: campaignReducer,
  databaseReducer:databaseReducer,
  productReducer:productReducer,
  activeReducerUTQ:activeReducerUTQ,
});
const rootReducer = (state, action) => {
  if (action.type === 'SIGNOUT_REQUEST') {
    AsyncStorage.removeItem('persist:root');
    state = undefined;
  }
  return appReducer(state, action);
};
// Exports
export default rootReducer;
