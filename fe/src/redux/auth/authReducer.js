import {
    ADD_CURRENT_ADMIN,
    REMOVE_AUTH_JWT,
    REMOVE_CURRENT_ADMIN,
    SET_AUTH_JWT,
} from "./authTypes.js";

export const initialState = {
    jwt: null,
    currentAdmin: {},
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_JWT:
            return {
                ...state,
                jwt: action.payload,
            };
        case REMOVE_AUTH_JWT:
            return {
                ...state,
                jwt: null,
            };
        case ADD_CURRENT_ADMIN:
            return {
                ...state,
                currentAdmin: action.payload,
            };
        case REMOVE_CURRENT_ADMIN:
            return {
                ...state,
                currentAdmin: {},
            };
        default:
            return state;
    }
};

export default authReducer;
