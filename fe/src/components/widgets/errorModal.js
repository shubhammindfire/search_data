import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { Modal, ModalBody } from "reactstrap";
import { LOGIN_ROUTE } from "./../../constants";

function ErrorModal(props) {
    const { message } = props;

    return (
        <Modal isOpen={true}>
            <ModalBody>
                <FontAwesomeIcon
                    icon={faExclamationCircle}
                    color="#FFA500"
                    className="me-2"
                />
                {message}
                <Link
                    to={{
                        pathname: LOGIN_ROUTE,
                        state: {
                            isSessionExpired: true,
                        },
                    }}
                >
                    <p className="text-center bg-primary">Go to login</p>
                </Link>
            </ModalBody>
        </Modal>
    );
}

export default ErrorModal;
