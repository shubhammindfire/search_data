import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import NoPageFound from "./components/pages/noPageFound.js";
import Login from "./components/pages/login.js";
import AdminDashboard from "./components/pages/adminDashboard";
import {
    ADMIN_DASHBOARD_ROUTE,
    LOGIN_ROUTE,
} from "./constants.js";
import { useDispatch, useSelector } from "react-redux";
import { setAuthJwt } from "./redux/auth/authActions";

function App() {
    const dispatch = useDispatch();
    const jwt = useSelector((state) => state.authReducer.jwt);

    // check if session variable has jwt or not
    let session_jwt = localStorage.getItem("session-jwt");
    session_jwt = session_jwt !== null ? JSON.parse(session_jwt) : null;
    let isSessionExpired = false;

    if (
        session_jwt !== null &&
        session_jwt.value.token !== null &&
        session_jwt.value.token !== "" &&
        session_jwt.expiry > new Date().getTime()
    ) {
        dispatch(setAuthJwt(session_jwt.value.token));
    } else if (
        session_jwt !== null &&
        session_jwt.expiry < new Date().getTime()
    ) {
        isSessionExpired = true;
    }

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return jwt === null || jwt === "" ? (
                                <Redirect
                                    to={{
                                        pathname: LOGIN_ROUTE,
                                        state: {
                                            isSessionExpired: isSessionExpired,
                                        },
                                    }}
                                />
                            ) : (
                                <Redirect to={ADMIN_DASHBOARD_ROUTE} />
                            );
                        }}
                    />
                    <Route path={LOGIN_ROUTE} exact component={Login} />
                    <Route
                        path={ADMIN_DASHBOARD_ROUTE}
                        exact
                        component={AdminDashboard}
                    />
                    <Route component={NoPageFound} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
