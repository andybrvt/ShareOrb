import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    error: null,
    loading: false
}

// takes in the objec tfor auth start and then update the
// auth start
const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
}

//takes in the object for authSuccess and updates it
const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        error: null,
        loading: false
    });
}

// takes in the state of the authFail and updates it
const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}

// takes in the state of the authLogout and updates it
const authLogout = (state, action) => {
    return updateObject(state, {
        token: null
    });
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        default:
            return state;
    }
}

export default reducer;
