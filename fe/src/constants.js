// server urls
export const BASE_SERVER_URL = "http://localhost:8000";
export const REGISTER_URL = BASE_SERVER_URL + "/api/admins";
export const LOGIN_URL = BASE_SERVER_URL + "/api/login";
export const GET_ALL_ADMINS_URL = BASE_SERVER_URL + "/api/admins";
export const ADD_ADMIN_BY_ID_URL = BASE_SERVER_URL + "/api/admins";
export const DELETE_ADMIN_BY_ID_URL = BASE_SERVER_URL + "/api/admins"; // actual endpoint - /api/admins/{id}
export const GET_ALL_PROPERTY_RECORDS_URL =
    BASE_SERVER_URL + "/api/property_records";

// react routes
export const BASE_REACT_ROUTE = "http://localhost:3000";
export const LOGIN_ROUTE = "/login";
export const ADMIN_MANAGEMENT_ROUTE = "/admin_management";
export const PROPERTY_RECORDS_MANAGEMENT_ROUTE = "/property_records_management";
export const SEARCH_ROUTE = "/search";
