import { SET_AUTH_JWT } from "./authTypes.js";

export const initialState = {
    jwt: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_JWT:
            return {
                ...state,
                jwt: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
