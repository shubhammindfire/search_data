import { SET_AUTH_JWT } from "./authTypes.js";

export const setAuthJwt = (jwt = "") => {
    return {
        type: SET_AUTH_JWT,
        payload: jwt,
    };
};
