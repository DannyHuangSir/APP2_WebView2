import * as types from './types';

const initState = {
  fastLogin: true,
  motp: false,
  isPasswordRequired: false,
  result: false,
};

const reducers = (state = initState, action) => {
  switch (action.type) {
    case types.SET_FAST_LOGIN:
      return {
        ...state,
        fastLogin: action.payload,
      };
    case types.SET_IS_PASSWORD_REQUIRED:
      return {
        ...state,
        isPasswordRequired: action.payload,
      };
    case types.SET_RESULT:
      return {
        ...state,
        result: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;