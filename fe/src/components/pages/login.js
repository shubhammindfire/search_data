import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Button, Card } from "reactstrap";
import TextField from "../widgets/textField";
import { LOGIN_URL, REGISTER_ROUTE } from "./../../constants.js";
// import { useSelector } from "react-redux";
// import checkSessionExpired from "../../utils/checkSessionExpired";
import "./../../styles/login.css";
import { validateEmail, validatePassword } from "../utils/validate";

function Login() {
    //     const jwt = useSelector((state) => state.localAuthReducer.jwt);
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    function handleEmailChange(e) {
        setLoginError(null);
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setLoginError(null);
        setPassword(e.target.value);
    }

    function clearSuccessAndErrorMessages() {
        setEmailError(null);
        setPasswordError(null);
        setSuccessMessage(null);
    }

    function validateAll() {
        if (!validateEmail(email)) {
            setEmailError("Please provide a valid email");
            return false;
        }
        if (!validatePassword(password)) {
            setPasswordError("Please provide a valid password");
            return false;
        }
        return true;
    }

    function handleLogin(e) {
        e.preventDefault();

        clearSuccessAndErrorMessages();

        if (validateAll()) {
            axios
                .post(LOGIN_URL, {
                    email: email,
                    password: password,
                })
                .then((response) => {
                    console.log(`Response: ${JSON.stringify(response)}`);
                    if (response.status === 200) {
                        // dispatch(setLocalAuthJwt(response.data));
                        const ttl = 3600000; // time for expiry in milliseconds
                        const itemToLocalStorage = {
                            value: response.data,
                            expiry: new Date().getTime() + ttl,
                        };
                        localStorage.setItem(
                            "session-jwt",
                            JSON.stringify(itemToLocalStorage)
                        );
                    } else {
                        setLoginError(response.message);
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        setLoginError(error.response.data.message);
                    }

                    console.log(
                        `Axios Error: ${JSON.stringify(error.response)}`
                    );
                });
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="mt-4 fs-1">Login</p>
            <div className="rounded-3 shadow p-4">
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        placeholder="Enter email"
                        type="text"
                        onChange={handleEmailChange}
                    />
                    {emailError !== null ? (
                        <p className="text-danger">{emailError}</p>
                    ) : null}
                    <TextField
                        label="Password"
                        placeholder="Enter password"
                        type="password"
                        onChange={handlePasswordChange}
                    />
                    {passwordError !== null ? (
                        <p className="text-danger">{passwordError}</p>
                    ) : null}
                    {loginError !== null ? (
                        <p className="text-danger">{loginError}</p>
                    ) : null}
                    <Button
                        type="submit"
                        color="primary"
                        className="mt-2 float-end"
                    >
                        Login
                    </Button>
                    {successMessage !== null ? (
                        <p className="text-success text-center">
                            {successMessage}
                        </p>
                    ) : null}
                </form>
            </div>

            <div className="mt-2">
                Not a registered user?
                <Link to={REGISTER_ROUTE} className="nounderline">
                    <p className="d-inline"> Register Instead</p>
                </Link>
            </div>
        </div>
    );
}

export default Login;
