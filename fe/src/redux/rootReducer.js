import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import adminReducer from "./admin/adminReducer";
import propertyRecordReducer from "./property_record/propertyRecordReducer";

const rootReducer = combineReducers({
    authReducer,
    adminReducer,
    propertyRecordReducer,
});

export default rootReducer;
