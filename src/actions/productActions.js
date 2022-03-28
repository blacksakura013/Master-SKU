import { PRODUCT_DATA, PUSH_LOG } from '../Constants';

export const setData = (payload) => ({
  type: PRODUCT_DATA,
  payload,
});

export const setLog_Data = (payload) => ({
  type: PUSH_LOG,
  payload,
});

