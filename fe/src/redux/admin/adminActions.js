import {
    ADD_ADMIN,
    EDIT_ADMIN_BY_INDEX,
    ADD_ALL_ADMINS,
    REMOVE_ALL_ADMINS,
    REMOVE_ADMIN_BY_INDEX,
} from "./adminTypes.js";

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

export const editAdminByIndex = (newAdmin = {}, id) => {
    return {
        type: EDIT_ADMIN_BY_INDEX,
        payload: { newAdmin: newAdmin, id: id },
    };
};

export const removeAdminByIndex = (index) => {
    return {
        type: REMOVE_ADMIN_BY_INDEX,
        payload: index, // here payload is the index of the admin to be deleted
    };
};
