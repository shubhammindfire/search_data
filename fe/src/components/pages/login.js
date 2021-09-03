import React, { useState } from "react";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import TextField from "../widgets/textField";
import { LOGIN_URL, ADMIN_MANAGEMENT_ROUTE } from "./../../constants.js";
import { useSelector, useDispatch } from "react-redux";
import checkSessionExpired from "./../utils/checkSessionExpired";
import { validateEmail, validatePassword } from "../utils/validate";
import { addCurrentAdmin, setAuthJwt } from "./../../redux/auth/authActions";

function Login(props) {
    const isSessionExpired =
        props.location.state !== undefined
            ? props.location.state.isSessionExpired
            : false;
    const dispatch = useDispatch();
    const jwt = useSelector((state) => state.authReducer.jwt);
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    function handleEmailChange(e) {
        console.log(`email = ${e.target.value}`);
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
                    // console.log(`Response: ${JSON.stringify(response)}`);
                    if (response.status === 200) {
                        dispatch(setAuthJwt(response.data));
                        dispatch(addCurrentAdmin({ email: email }));
                        const ttl = 3600000; // time for expiry in milliseconds
                        const jwtToLocalStorage = {
                            value: response.data,
                            expiry: new Date().getTime() + ttl,
                        };
                        const currentAdminToLocalStorage = {
                            value: { email: email },
                            expiry: new Date().getTime() + ttl,
                        };
                        localStorage.setItem(
                            "session-jwt",
                            JSON.stringify(jwtToLocalStorage)
                        );
                        localStorage.setItem(
                            "current-admin",
                            JSON.stringify(currentAdminToLocalStorage)
                        );
                        setTimeout(() => {
                            history.push({ ADMIN_MANAGEMENT_ROUTE });
                        }, 1500);
                    } else {
                        setLoginError(response.data.message);
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
        <>
            {jwt !== null && checkSessionExpired() === false ? (
                // if the admin is logged in and session is not expired then redirect to admin dashboard
                <Redirect to={ADMIN_MANAGEMENT_ROUTE} />
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center">
                    {isSessionExpired ? (
                        <p className="text-danger">
                            Session Expired Login again
                        </p>
                    ) : null}
                    <p className="mt-4 fs-1">Login</p>
                    <div className="rounded-3 shadow p-4">
                        <form onSubmit={handleLogin}>
                            <TextField
                                label="Email"
                                placeholder="Enter email"
                                type="text"
                                autofocus={true}
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
                </div>
            )}
        </>
    );
}

export default Login;
