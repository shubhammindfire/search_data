import React, { useState } from "react";
import Loader from "react-loader-spinner";
import { Button, Modal, ModalBody } from "reactstrap";

function AddAdminModal(props) {
    // const {setShowAddAdminModal} = props;
    const {showAddAdminModal} = props;
    return (
        <Modal isOpen={showAddAdminModal}>
        {/* <Modal isOpen={true}> */}
            <ModalBody>
                <Loader type="Watch" color="#000000" height={80} width={80} />
                Add Admin
            </ModalBody>
            <Button color="danger" >
                Close
            </Button>
        </Modal>
    );
}

export default AddAdminModal;
