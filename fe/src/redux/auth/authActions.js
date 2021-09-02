import {
    ADD_CURRENT_ADMIN,
    REMOVE_AUTH_JWT,
    REMOVE_CURRENT_ADMIN,
    SET_AUTH_JWT,
} from "./authTypes.js";

export const setAuthJwt = (jwt = "") => {
    return {
        type: SET_AUTH_JWT,
        payload: jwt,
    };
};

export const removeAuthJwt = () => {
    return {
        type: REMOVE_AUTH_JWT,
    };
};

export const addCurrentAdmin = (currentAdmin = {}) => {
    return {
        type: ADD_CURRENT_ADMIN,
        payload: currentAdmin,
    };
};

export const removeCurrentAdmin = () => {
    return {
        type: REMOVE_CURRENT_ADMIN,
    };
};
