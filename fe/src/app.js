import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import NoPageFound from "./components/pages/noPageFound.js";
import Login from "./components/pages/login.js";
import {
    ADMIN_MANAGEMENT_ROUTE,
    LOGIN_ROUTE,
    PROPERTY_RECORDS_MANAGEMENT_ROUTE,
    SEARCH_ROUTE,
} from "./constants.js";
import { useDispatch } from "react-redux";
import { addCurrentAdmin, setAuthJwt } from "./redux/auth/authActions";
import AdminManagement from "./components/pages/adminManagement";
import PropertyRecordsManagement from "./components/pages/propertyRecordsManagement.js";
import Search from "./components/pages/search.js";

function App() {
    const dispatch = useDispatch();

    // check if session variable has jwt or not
    let session_jwt = localStorage.getItem("session-jwt");
    session_jwt = session_jwt !== null ? JSON.parse(session_jwt) : null;

    if (
        session_jwt !== null &&
        session_jwt.value.token !== null &&
        session_jwt.value.token !== "" &&
        session_jwt.expiry > new Date().getTime()
    ) {
        dispatch(setAuthJwt(session_jwt.value.token));

        // if jwt is available then we can check and store the current admin as well
        let current_admin = localStorage.getItem("current-admin");
        current_admin =
            current_admin !== null ? JSON.parse(current_admin) : null;
        dispatch(addCurrentAdmin(current_admin.value));
    }

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return <Redirect to={SEARCH_ROUTE} />;
                        }}
                    />
                    <Route path={LOGIN_ROUTE} exact component={Login} />
                    <Route
                        path={ADMIN_MANAGEMENT_ROUTE}
                        exact
                        component={AdminManagement}
                    />
                    <Route
                        path={PROPERTY_RECORDS_MANAGEMENT_ROUTE}
                        exact
                        component={PropertyRecordsManagement}
                    />
                    <Route path={SEARCH_ROUTE} exact component={Search} />
                    <Route component={NoPageFound} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
