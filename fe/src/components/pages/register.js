import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Button, Card } from "reactstrap";
import TextField from "../widgets/textField";
import { REGISTER_URL, LOGIN_ROUTE } from "./../../constants.js";
// import { useSelector } from "react-redux";
// import checkSessionExpired from "../../utils/checkSessionExpired";
import "./../../styles/register.css";
import {
    validateEmail,
    validateEmptyField,
    validatePassword,
} from "../utils/validate";

function Register() {
    //     const jwt = useSelector((state) => state.localAuthReducer.jwt);
    const jwt = "dummmy jwt";
    const history = useHistory();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [firstnameError, setFirstnameError] = useState(null);
    const [lastnameError, setLastnameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const LOCAL_FIRST_NAME = "First Name";
    const LOCAL_LAST_NAME = "Last Name";

    function handleFirstnameLastnameChange(e, type) {
        console.log(`type = ${type}`);
        if (type === LOCAL_FIRST_NAME) setFirstname(e.target.value);
        else if (type === LOCAL_LAST_NAME) setLastname(e.target.value);
    }

    function handleEmailChange(e) {
        setEmailError(null);
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPasswordError(null);
        setPassword(e.target.value);
    }

    function clearSuccessAndErrorMessages() {
        setFirstnameError(null);
        setLastnameError(null);
        setEmailError(null);
        setPasswordError(null);
        setSuccessMessage(null);
    }

    function validateAll() {
        if (!validateEmptyField(firstname)) {
            setFirstnameError("Please fill this field");
            return false;
        }
        if (!validateEmptyField(lastname)) {
            setLastnameError("Please fill this field");
            return false;
        }
        if (!validateEmail(email)) {
            setEmailError("Please provide a valid email");
            return false;
        }
        if (!validatePassword(password)) {
            setPasswordError(
                "Passwords must be at least 7 characters long and contain at least one digit , one uppercaseletter, and one lowercase letter"
            );
            return false;
        }
        return true;
    }

    function handleRegister(e) {
        e.preventDefault();
        clearSuccessAndErrorMessages();
        // const jwt =
        //     "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MzA1MDAzMzQsImV4cCI6MTYzMDUwMzkzNCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoiYWRtaW4yQGVtYWlsLmNvbSJ9.Fc6l0HRdbgh2_KFbK9XQNuCoXQ_cnFMKiZ4JJukXN8cOuLs_2qPg1y18ni0vikHLxLEyMOFOmpqystvCTAPr0JFBEK_RzplwGec2mEgeTJy57ilcynjNI3bIzBMWoSyz261_kgBWaEz1GZ2oXZU84Yu5MsiCzUJEft-ijKnHU7Lj_jQPAUv4AD8M-M2SR864ezyijbhkCRUJ4AcYJJcmVbS5zQH1klp8wdaCFkbTJtTN854MZ_z4TY3RJSCpQvK3vQsa2-cdNZAUARlBCFQ8ecLxq6A-7puHIONkVC2nLzXb82eXOSnYrhRba02ZbHsGeTMEsTAyDd3vNHyC1bbkWHB8FRLJvoneswkhazbOtH39PsiE0vvH8q-NpHilJzqs5QdK54cT_errRasXgLblGHzqCHezVGh9xrhL7qg6ZXp-lGpx77k2nvdnIxYcjdztA03TLHLadxRJW1A0qVrXLLGCFsrrR3fs3qObQx-xc-hh158wfkJ1ZGXnxNzGKiIOvzCSfOr5GL3gFhxISTDk49HmirbcqZoS1KIBsSOutUIuCcc1qqjFeJiZKZzVYgYOGi8H5rQPv1odB30UZGJIv0hp4U-_3LLvmezDN7oEmgWg32kMy1a3vzNyMH4zcLLNVrr3YRl3awO_46CIL9sk9GBIDxTVynlxHJTjc1-8Hk0";
        if (validateAll()) {
            axios
                .post(
                    REGISTER_URL,
                    {
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: password,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwt}` },
                    }
                )
                .then((response) => {
                    //     console.log(`Response: ${JSON.stringify(response)}`);
                    if (response.status === 201) {
                        setSuccessMessage("User registered successfully");
                        // delay and then route to /login after successfull register
                        setTimeout(() => {
                            history.push({ LOGIN_ROUTE });
                        }, 1500);
                    } else {
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        const violations = error.response.data.violations;
                        violations.forEach((violation) => {
                            if (violation["propertyPath"] === "email")
                                setEmailError(violation["message"]);
                            if (violation.propertyPath === "password")
                                setPasswordError(violation["message"]);
                        });
                    }
                    //     console.log(
                    //         `Axios Error: ${JSON.stringify(error.response)}`
                    //     );
                });
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="mt-4 fs-1">Register</p>
            <div className="rounded-3 shadow p-4">
                <form onSubmit={handleRegister}>
                    <TextField
                        label="First name"
                        placeholder="Enter first name"
                        type="text"
                        onChange={(e) =>
                            handleFirstnameLastnameChange(e, LOCAL_FIRST_NAME)
                        }
                    />
                    {firstnameError !== null ? (
                        <p className="text-danger">{firstnameError}</p>
                    ) : null}
                    <TextField
                        label="Last name"
                        placeholder="Enter last name"
                        type="text"
                        onChange={(e) =>
                            handleFirstnameLastnameChange(e, LOCAL_LAST_NAME)
                        }
                    />
                    {lastnameError !== null ? (
                        <p className="text-danger">{lastnameError}</p>
                    ) : null}
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
                        <p className="text-danger password-error-message">
                            {passwordError}
                        </p>
                    ) : null}
                    <Button
                        type="submit"
                        color="primary"
                        className="mt-2 float-end"
                    >
                        Register
                    </Button>
                    {successMessage !== null ? (
                        <p className="text-success text-center">
                            {successMessage}
                        </p>
                    ) : null}
                </form>
            </div>

            <div className="mt-2">
                Already registered?
                <Link to={LOGIN_ROUTE} className="nounderline">
                    <p className="d-inline"> Login Instead</p>
                </Link>
            </div>
        </div>
    );
}

export default Register;
