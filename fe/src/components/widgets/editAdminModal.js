import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { EDIT_ADMIN_BY_ID_URL } from "../../constants";
import { editAdminByIndex } from "../../redux/admin/adminActions";
import {
    validateEmail,
    validateEmptyField,
    validatePassword,
} from "../utils/validate";
import LoadingModal from "./loadingModal";
import TextField from "./textField";

function EditAdminModal(props) {
    const { setShowEditAdminModal, jwt, dispatch, admin } = props;
    const [firstname, setFirstname] = useState(admin.firstname);
    const [lastname, setLastname] = useState(admin.lastname);
    const [email, setEmail] = useState(admin.email);
    const [password, setPassword] = useState("");
    const [showLoading, setShowLoading] = useState(false);

    const [firstnameError, setFirstnameError] = useState(null);
    const [lastnameError, setLastnameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const LOCAL_FIRST_NAME = "First Name";
    const LOCAL_LAST_NAME = "Last Name";

    function handleFirstnameLastnameChange(e, type) {
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
        if (password !== "" && !validatePassword(password)) {
            setPasswordError(
                "Passwords must be at least 7 characters long and contain at least one digit , one uppercaseletter, and one lowercase letter"
            );
            return false;
        }
        return true;
    }

    function handleEdit(e) {
        e.preventDefault();
        const adminObject =
            password === ""
                ? {
                      firstname: firstname,
                      lastname: lastname,
                      email: email,
                  }
                : {
                      firstname: firstname,
                      lastname: lastname,
                      email: email,
                      password: password,
                  };
        clearSuccessAndErrorMessages();
        if (validateAll()) {
            setShowLoading(true);
            axios
                .patch(EDIT_ADMIN_BY_ID_URL + `/${admin.id}`, adminObject, {
                    headers: { Authorization: `Bearer ${jwt}` },
                })
                .then((response) => {
                    setShowLoading(false);
                    if (response.status === 200) {
                        setSuccessMessage("Admin edited successfully");
                        setShowEditAdminModal(false);
                        dispatch(editAdminByIndex(adminObject, admin.id));
                    } else {
                    }
                })
                .catch((error) => {
                    setShowLoading(false);
                    if (error.response) {
                        const violations = error.response.data.violations;
                        violations.forEach((violation) => {
                            if (violation["propertyPath"] === "email")
                                setEmailError(violation["message"]);
                            if (violation.propertyPath === "password")
                                setPasswordError(violation["message"]);
                        });
                    }
                });
        }
    }

    return (
        <Modal isOpen={true} autoFocus={false}>
            <ModalHeader>Edit Admin</ModalHeader>
            <ModalBody>
                <form onSubmit={handleEdit}>
                    <TextField
                        label="First Name"
                        placeholder="Enter First Name"
                        type="text"
                        autofocus={true}
                        defaultValue={firstname}
                        onChange={(e) =>
                            handleFirstnameLastnameChange(e, LOCAL_FIRST_NAME)
                        }
                    />
                    {firstnameError !== null ? (
                        <p className="text-danger">{firstnameError}</p>
                    ) : null}
                    <TextField
                        label="Last Name"
                        placeholder="Enter Last Name"
                        type="text"
                        defaultValue={lastname}
                        onChange={(e) =>
                            handleFirstnameLastnameChange(e, LOCAL_LAST_NAME)
                        }
                    />
                    {lastnameError !== null ? (
                        <p className="text-danger">{lastnameError}</p>
                    ) : null}
                    <TextField
                        label="Email"
                        placeholder="Enter Email"
                        type="text"
                        defaultValue={email}
                        onChange={(e) => handleEmailChange(e)}
                    />
                    {emailError !== null ? (
                        <p className="text-danger">{emailError}</p>
                    ) : null}
                    <TextField
                        label="New Password *(If left empty then old password will be used)"
                        placeholder="Enter New Password"
                        type="text"
                        onChange={(e) => handlePasswordChange(e)}
                    />
                    {passwordError !== null ? (
                        <p className="text-danger password-error-message">
                            {passwordError}
                        </p>
                    ) : null}
                    {successMessage !== null ? (
                        <p className="text-success text-center">
                            {successMessage}
                        </p>
                    ) : null}
                    {showLoading ? <LoadingModal /> : null}
                    <Button
                        type="submit"
                        color="primary"
                        className="mt-2 float-end"
                    >
                        Save
                    </Button>
                    <Button
                        color="danger"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowEditAdminModal(false);
                        }}
                    >
                        Close
                    </Button>
                </form>
            </ModalBody>
        </Modal>
    );
}

export default EditAdminModal;
