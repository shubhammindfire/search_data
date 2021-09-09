import axios from "axios";
import React, { useState } from "react";
import Loader from "react-loader-spinner";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { IMPORT_PROPERTY_RECORDS_DATA_URL } from "../../constants";
import {
    addAllPropertyRecords,
    addAllPropertyRecordsFromImport,
} from "../../redux/property_record/propertyRecordActions";

function ImportModal(props) {
    const { setShowImportModal, jwt, dispatch } = props;

    const [csvFile, setCsvFile] = useState(null);
    const [zipFile, setZipFile] = useState(null);
    const [showLoading, setShowLoading] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const LOCAL_CSV_FILE = "CSV_File";
    const LOCAL_ZIP_FILE = "Zip_File";

    const handleFileChange = (e, type) => {
        // clearing error message
        setErrorMessage(null);
        if (type === LOCAL_CSV_FILE) setCsvFile(e.target.files[0]);
        if (type === LOCAL_ZIP_FILE) setZipFile(e.target.files[0]);
    };

    function handleImportPropertyRecord(e) {
        e.preventDefault();

        let form_data = new FormData();
        form_data.append("csv-file", csvFile);
        form_data.append("zip-file", zipFile);
        setShowLoading(true);
        axios
            .post(IMPORT_PROPERTY_RECORDS_DATA_URL, form_data, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((response) => {
                setShowLoading(false);
                if (response.status === 201) {
                    dispatch(addAllPropertyRecords(response.data));
                    setShowImportModal(false);
                }
            })
            .catch((error) => {
                setShowLoading(false);
                if (error.response) {
                    console.log(JSON.stringify(error.response.data["Error"]));
                    setErrorMessage(error.response.data["Error"]);
                }
            });
    }

    return (
        <Modal isOpen={true} autoFocus={false}>
            <ModalHeader>Import</ModalHeader>
            <ModalBody>
                {showLoading ? (
                    <div className="m-3">
                        <Loader
                            type="Watch"
                            color="#000000"
                            height={80}
                            width={80}
                        />
                        Please Wait..
                    </div>
                ) : null}
                <form onSubmit={handleImportPropertyRecord}>
                    <label htmlFor="csv" className="d-block">
                        CSV file
                    </label>
                    <input
                        type="file"
                        id="csv"
                        accept=".csv"
                        className="m-2"
                        onChange={(e) => handleFileChange(e, LOCAL_CSV_FILE)}
                        required
                    />
                    <label htmlFor="zip" className="d-block">
                        Zip file
                    </label>
                    <input
                        type="file"
                        id="zip"
                        accept="application/zip"
                        className="m-2"
                        onChange={(e) => handleFileChange(e, LOCAL_ZIP_FILE)}
                        required
                    />
                    {errorMessage !== null ? (
                        <p className="text-danger text-center">
                            {errorMessage}
                        </p>
                    ) : null}
                    <div className="mt-3">
                        <Button
                            type="submit"
                            color="primary"
                            className="mt-2 float-end"
                        >
                            Import
                        </Button>
                        <Button
                            color="danger float-start"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowImportModal(false);
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
}

export default ImportModal;
