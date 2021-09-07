import React from "react";
import Loader from "react-loader-spinner";
import { Modal, ModalBody } from "reactstrap";

function LoadingModal() {
    return (
        <Modal isOpen={true}>
            <ModalBody>
                <Loader type="Watch" color="#000000" height={80} width={80} />
                Please Wait ..
            </ModalBody>
        </Modal>
    );
}

export default LoadingModal;
