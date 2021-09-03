import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { PUBLIC_IMAGES_FOLDER } from "../../constants";
import "./../../styles/imageModal.css";

function ImageModal(props) {
    const { currentImage, setShowImageModal } = props;
    return (
        <Modal isOpen={true}>
            <ModalHeader>Property Image</ModalHeader>
            <ModalBody>
                {/* <img
                    className="image"
                    src={PUBLIC_IMAGES_FOLDER + currentImage}
                    alt={currentImage}
                /> */}
            </ModalBody>
            <ModalFooter>
                <Button
                    color="danger"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowImageModal(false);
                    }}
                >
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ImageModal;
