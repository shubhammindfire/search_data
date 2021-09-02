import { ADD_ADMIN, EDIT_ADMIN, ADD_ALL_ADMINS, REMOVE_ADMIN, REMOVE_ALL_ADMINS } from "./adminTypes.js";

export const addAllAdmins = (admins = []) => {
    return {
        type: ADD_ALL_ADMINS,
        payload: admins,
    };
};

export const removeAllAdmins = () => {
    return {
        type: REMOVE_ALL_ADMINS,
    };
};

export const addAdmin = (admin = {}) => {
    return {
        type: ADD_ADMIN,
        payload: admin,
    };
};

export const editAdmin = (newAdmin = {}) => {
    return {
        type: EDIT_ADMIN,
        payload: newAdmin,
    };
};

export const removeAdmin = (index) => {
    return {
        type: REMOVE_ADMIN,
        payload: index, // here payload is the index of the admin to be deleted
    };
};
