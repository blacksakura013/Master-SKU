import { PRODUCT_DATA, PUSH_LOG } from '../Constants';
const initialState = {
  Data: [],
  Log_data: [],
};

const productReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PRODUCT_DATA:
      return { ...state, Data: payload };

    case PUSH_LOG:
      return { ...state, Log_data: payload };
    default:
      return state;
  }
};
export default productReducer;
