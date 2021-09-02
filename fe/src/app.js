import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import NoPageFound from "./components/pages/noPageFound.js";
import Register from "./components/pages/register.js";
import Login from "./components/pages/login.js";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "./constants.js";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    {/* <Route
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
                                <Redirect to={PORTAL_ROUTE} />
                            );
                        }}
                    /> */}
                    <Route path={LOGIN_ROUTE} exact component={Login} />
                    <Route path={REGISTER_ROUTE} exact component={Register} />
                    <Route component={NoPageFound} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
