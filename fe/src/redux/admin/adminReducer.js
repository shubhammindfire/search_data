import {
    ADD_ADMIN,
    ADD_ALL_ADMINS,
    EDIT_ADMIN,
    REMOVE_ADMIN_BY_INDEX,
    REMOVE_ALL_ADMINS,
} from "./adminTypes.js";

export const initialState = {
    admins: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_ADMINS:
            return {
                ...state,
                admins: action.payload,
            };
        case REMOVE_ALL_ADMINS:
            return {
                ...state,
                admins: [],
            };
        case ADD_ADMIN:
            return {
                ...state,
                admins: [...state.admins, ...action.payload],
            };
        case REMOVE_ADMIN_BY_INDEX:
            return {
                ...state,
                admins: [
                    // here action.payload is the index of the admin to be deleted
                    ...state.admins.slice(0, action.payload),
                    ...state.admins.slice(action.payload + 1),
                ],
            };
        default:
            return state;
    }
};

export default adminReducer;
