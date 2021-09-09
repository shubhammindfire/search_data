import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
    BASE_SERVER_URL,
    GET_PROPERTY_RECORD_IMAGE_URL,
} from "../../constants";
import "./../../styles/imageModal.css";

function ImageModal(props) {
    const { currentImageRecordId, setShowImageModal } = props;

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        axios
            .get(
                `${GET_PROPERTY_RECORD_IMAGE_URL}/${currentImageRecordId}/imageUrl`
            )
            .then((response) => {
                setImageUrl(response.data.imageUrl);
            })
            .catch((error) => {});
    }, [currentImageRecordId]);

    return (
        <Modal isOpen={true}>
            <ModalHeader>Property Image</ModalHeader>
            <ModalBody>
                <img
                    className="image"
                    src={`${BASE_SERVER_URL}/${imageUrl}`}
                    alt={imageUrl}
                />
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
