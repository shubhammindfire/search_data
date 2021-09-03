import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import {
    EDIT_ADMIN_BY_ID_URL,
    EDIT_PROPERTY_RECORD_BY_ID_URL,
} from "../../constants";
import { editAdminByIndex } from "../../redux/admin/adminActions";
import { editPropertyRecordByIndex } from "../../redux/property_record/propertyRecordActions";
import {
    validateEmail,
    validateEmptyField,
    validatePassword,
} from "../utils/validate";
import LoadingModal from "./loadingModel";
import TextField from "./textField";

function EditPropertyRecordModal(props) {
    const { setShowEditPropertyRecordModal, jwt, dispatch, propertyRecord } =
        props;
    console.log(`current record = ${JSON.stringify(propertyRecord)}`);

    const [section, setSection] = useState(propertyRecord.section);
    const [town, setTown] = useState(propertyRecord.town);
    const [range, setRange] = useState(propertyRecord.rng); // range is named rng in the backend
    const [subdivision, setSubdivision] = useState(propertyRecord.subdivision);
    const [description, setDescription] = useState(propertyRecord.description);
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

    function handleEditPropertyRecord(e) {
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
                .patch(
                    EDIT_PROPERTY_RECORD_BY_ID_URL + `/${propertyRecord.id}`,
                    propertyRecordObject,
                    {
                        headers: { Authorization: `Bearer ${jwt}` },
                    }
                )
                .then((response) => {
                    setShowLoading(false);
                    if (response.status === 200) {
                        setSuccessMessage(
                            "Property Record edited successfully"
                        );
                        setShowEditPropertyRecordModal(false);
                        dispatch(
                            editPropertyRecordByIndex(
                                propertyRecordObject,
                                propertyRecord.id
                            )
                        );
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
            <ModalHeader>Edit Admin</ModalHeader>
            <ModalBody>
                <form onSubmit={handleEditPropertyRecord}>
                    <TextField
                        label={LOCAL_SECTION}
                        placeholder={`Enter ${LOCAL_SECTION}`}
                        type="number"
                        autofocus={true}
                        defaultValue={section}
                        onChange={(e) => handleFieldChange(e, LOCAL_SECTION)}
                    />
                    {sectionError !== null ? (
                        <p className="text-danger">{sectionError}</p>
                    ) : null}
                    <TextField
                        label={LOCAL_TOWN}
                        placeholder={`Enter ${LOCAL_TOWN}`}
                        type="number"
                        defaultValue={town}
                        onChange={(e) => handleFieldChange(e, LOCAL_TOWN)}
                    />
                    {townError !== null ? (
                        <p className="text-danger">{townError}</p>
                    ) : null}
                    <TextField
                        label={LOCAL_RANGE}
                        placeholder={`Enter ${LOCAL_RANGE}`}
                        type="number"
                        defaultValue={range}
                        onChange={(e) => handleFieldChange(e, LOCAL_RANGE)}
                    />
                    {rangeError !== null ? (
                        <p className="text-danger">{rangeError}</p>
                    ) : null}
                    <TextField
                        label={LOCAL_SUBDIVISION}
                        placeholder={`Enter ${LOCAL_SUBDIVISION}`}
                        type="text"
                        defaultValue={subdivision}
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
                        defaultValue={description}
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
                        Save
                    </Button>
                    <Button
                        color="danger"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowEditPropertyRecordModal(false);
                        }}
                    >
                        Close
                    </Button>
                </form>
            </ModalBody>
        </Modal>
    );
}

export default EditPropertyRecordModal;
