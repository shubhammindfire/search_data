import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { ADD_PROPERTY_RECORD_URL, REGISTER_URL } from "../../constants";
import { addAdmin } from "../../redux/admin/adminActions";
import { addPropertyRecord } from "../../redux/property_record/propertyRecordActions";
import { validateEmptyField } from "../utils/validate";
import LoadingModal from "./loadingModel";
import TextField from "./textField";

function AddPropertyRecordModal(props) {
    const { setShowAddPropertyRecordModal, jwt, dispatch } = props;
    const [section, setSection] = useState(null);
    const [town, setTown] = useState(null);
    const [range, setRange] = useState(null);
    const [subdivision, setSubdivision] = useState("");
    const [description, setDescription] = useState("");
    const [showLoading, setShowLoading] = useState(false);

    const [sectionError, setSectionError] = useState(null);
    const [townError, setTownError] = useState(null);
    const [rangeError, setRangeError] = useState(null);
    const [subdivisionError, setSubdivisionError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const LOCAL_SECTION = "Section";
    const LOCAL_TOWN = "Town";
    const LOCAL_RANGE = "Range";
    const LOCAL_SUBDIVISION = "Subdivision";
    const LOCAL_DESCRIPTION = "Description";

    function handleFieldChange(e, type) {
        clearSuccessAndErrorMessages();
        if (type === LOCAL_SECTION) setSection(e.target.value);
        else if (type === LOCAL_TOWN) setTown(e.target.value);
        else if (type === LOCAL_RANGE) setRange(e.target.value);
        else if (type === LOCAL_SUBDIVISION) setSubdivision(e.target.value);
        else if (type === LOCAL_DESCRIPTION) setDescription(e.target.value);
    }

    function clearSuccessAndErrorMessages() {
        setSectionError(null);
        setTownError(null);
        setRangeError(null);
        setSubdivisionError(null);
        setSuccessMessage(null);
    }

    function validateAll() {
        if (!validateEmptyField(section) || section < 1) {
            setSectionError("Please fill a proper value for this field");
            return false;
        }
        if (!validateEmptyField(town) || town < 1) {
            setTownError("Please fill a proper value this field");
            return false;
        }
        if (!validateEmptyField(range) || range < 1) {
            setRangeError("Please fill a proper value this field");
            return false;
        }
        if (!validateEmptyField(subdivision)) {
            setSubdivisionError("Please fill this field");
            return false;
        }
        if (!validateEmptyField(description)) {
            setDescriptionError("Please fill this field");
            return false;
        }
        return true;
    }

    function handleRegister(e) {
        e.preventDefault();
        const propertyRecordObject = {
            section: parseInt(section),
            town: parseInt(town),
            rng: parseInt(range), // range is named rng in the backend
            subdivision: subdivision,
            description: description,
        };
        clearSuccessAndErrorMessages();
        if (validateAll()) {
            setShowLoading(true);
            axios
                .post(ADD_PROPERTY_RECORD_URL, propertyRecordObject, {
                    headers: { Authorization: `Bearer ${jwt}` },
                })
                .then((response) => {
                    setShowLoading(false);
                    if (response.status === 201) {
                        setSuccessMessage("Property Record added successfully");
                        setShowAddPropertyRecordModal(false);
                        dispatch(addPropertyRecord(propertyRecordObject));
                    } else {
                    }
                })
                .catch((error) => {
                    setShowLoading(false);
                    if (error.response) {
                        const violations = error.response.data.violations;
                    }
                });
        }
    }

    return (
        <Modal isOpen={true} autoFocus={false}>
            <ModalHeader>Add Property Record</ModalHeader>
            <ModalBody>
                <form onSubmit={handleRegister}>
                    <TextField
                        label={LOCAL_SECTION}
                        placeholder={`Enter ${LOCAL_SECTION}`}
                        type="number"
                        autofocus={true}
                        onChange={(e) => handleFieldChange(e, LOCAL_SECTION)}
                    />
                    {sectionError !== null ? (
                        <p className="text-danger">{sectionError}</p>
                    ) : null}
                    <TextField
                        label={LOCAL_TOWN}
                        placeholder={`Enter ${LOCAL_TOWN}`}
                        type="number"
                        onChange={(e) => handleFieldChange(e, LOCAL_TOWN)}
                    />
                    {townError !== null ? (
                        <p className="text-danger">{townError}</p>
                    ) : null}
                    <TextField
                        label={LOCAL_RANGE}
                        placeholder={`Enter ${LOCAL_RANGE}`}
                        type="number"
                        onChange={(e) => handleFieldChange(e, LOCAL_RANGE)}
                    />
                    {rangeError !== null ? (
                        <p className="text-danger">{rangeError}</p>
                    ) : null}
                    <TextField
                        label={LOCAL_SUBDIVISION}
                        placeholder={`Enter ${LOCAL_SUBDIVISION}`}
                        type="text"
                        onChange={(e) =>
                            handleFieldChange(e, LOCAL_SUBDIVISION)
                        }
                    />
                    {subdivisionError !== null ? (
                        <p className="text-danger">{subdivisionError}</p>
                    ) : null}
                    <TextField
                        label={LOCAL_DESCRIPTION}
                        placeholder={`Enter ${LOCAL_DESCRIPTION}`}
                        type="text"
                        onChange={(e) =>
                            handleFieldChange(e, LOCAL_DESCRIPTION)
                        }
                    />
                    {descriptionError !== null ? (
                        <p className="text-danger">{descriptionError}</p>
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
                        Add
                    </Button>
                    <Button
                        color="danger"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowAddPropertyRecordModal(false);
                        }}
                    >
                        Close
                    </Button>
                </form>
            </ModalBody>
        </Modal>
    );
}

export default AddPropertyRecordModal;
