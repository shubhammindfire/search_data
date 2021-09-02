import {
    ADD_ALL_PROPERTY_RECORDS,
    ADD_PROPERTY_RECORD,
    REMOVE_ALL_PROPERTY_RECORDS,
    REMOVE_PROPERTY_RECORD,
} from "./propertyRecordTypes";

export const initialState = {
    propertyRecords: [],
};

const propertyRecordReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_PROPERTY_RECORDS:
            return {
                ...state,
                propertyRecords: action.payload,
            };
        case REMOVE_ALL_PROPERTY_RECORDS:
            return {
                ...state,
                propertyRecords: [],
            };
        case ADD_PROPERTY_RECORD:
            return {
                ...state,
                propertyRecords: [...state.propertyRecords, ...action.payload],
            };
        case REMOVE_PROPERTY_RECORD:
            return {
                ...state,
                propertyRecords: [
                    // here action.payload is the index of the propertyRecord to be deleted
                    ...state.propertyRecords.slice(0, action.payload),
                    ...state.propertyRecords.slice(action.payload + 1),
                ],
            };
        default:
            return state;
    }
};

export default propertyRecordReducer;
