import {
    ADD_ALL_PROPERTY_RECORDS,
    ADD_PROPERTY_RECORD,
    EDIT_PROPERTY_RECORD_BY_INDEX,
    REMOVE_ALL_PROPERTY_RECORDS,
    REMOVE_PROPERTY_RECORD_BY_INDEX,
} from "./propertyRecordTypes";

export const addAllPropertyRecords = (propertyRecords = []) => {
    return {
        type: ADD_ALL_PROPERTY_RECORDS,
        payload: propertyRecords,
    };
};

export const removeAllPropertyRecords = () => {
    return {
        type: REMOVE_ALL_PROPERTY_RECORDS,
    };
};

export const addPropertyRecord = (propertyRecord = {}) => {
    return {
        type: ADD_PROPERTY_RECORD,
        payload: propertyRecord,
    };
};

export const editPropertyRecordByIndex = (newPropertyRecord = {}, id) => {
    return {
        type: EDIT_PROPERTY_RECORD_BY_INDEX,
        payload: { newPropertyRecord: newPropertyRecord, id: id },
    };
};

export const removePropertyRecordByIndex = (index) => {
    return {
        type: REMOVE_PROPERTY_RECORD_BY_INDEX,
        payload: index, // here payload is the index of the propertyRecord to be deleted
    };
};
