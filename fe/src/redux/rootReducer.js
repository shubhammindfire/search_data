import { combineReducers } from "redux";
import authReducer from "./auth/authReducer.js";

const rootReducer = combineReducers({
    authReducer,
});

export default rootReducer;
