import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { GET_ALL_PROPERTY_RECORDS_URL, LOGIN_ROUTE } from "../../constants";
import ProjectNavbar from "../widgets/projectNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
    addAllPropertyRecords,
    removeAllPropertyRecords,
} from "./../../redux/property_record/propertyRecordActions";
import { Button } from "reactstrap";
import handleDeletePropertyRecord from "../utils/deletePropertyRecord";
import LoadingModal from "../widgets/loadingModel";
import AddPropertyRecordModal from "../widgets/addPropertyRecordModal";
import ImageModal from "../widgets/imageModel";

const PropertyRecordsManagement = () => {
    const dispatch = useDispatch();
    const propertyRecords = useSelector(
        (state) => state.propertyRecordReducer.propertyRecords
    );
    const jwt = useSelector((state) => state.authReducer.jwt);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showAddPropertyRecordModal, setShowAddPropertyRecordModal] =
        useState(false);

    useEffect(() => {
        axios
            .get(GET_ALL_PROPERTY_RECORDS_URL, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                dispatch(addAllPropertyRecords(response.data["hydra:member"]));
            })
            .catch((error) => {
                if (error.response.data.code === 401) {
                    setIsSessionExpired(true);
                }
            });
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllPropertyRecords());
        };
    }, [dispatch, jwt]);

    return (
        <>
            {jwt === null ? (
                // if the user is not logged in then redirect to login
                <Redirect to={LOGIN_ROUTE} />
            ) : (
                <div>
                    <ProjectNavbar />
                    <div className="m-4">
                        <h2>Property Records</h2>
                        {showLoadingModal ? <LoadingModal /> : null}
                        {showImageModal ? (
                            <ImageModal
                                currentImage={currentImage}
                                setShowImageModal={setShowImageModal}
                            />
                        ) : null}
                        {showAddPropertyRecordModal ? (
                            <AddPropertyRecordModal
                                setShowAddPropertyRecordModal={
                                    setShowAddPropertyRecordModal
                                }
                                jwt={jwt}
                                dispatch={dispatch}
                                propertyRecords={propertyRecords}
                            />
                        ) : null}
                        <Button
                            className="float-end bg-success border border-0"
                            title="Add a new Property Record"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowAddPropertyRecordModal(true);
                            }}
                        >
                            New
                        </Button>
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th scope="col">Edit</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Section</th>
                                    <th scope="col">Town</th>
                                    <th scope="col">Range</th>
                                    <th scope="col">Subdivision</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {propertyRecords.map(
                                    (propertyRecord, index) => {
                                        return (
                                            <tr key={propertyRecord.id}>
                                                <td>
                                                    <button className="iconButton">
                                                        <FontAwesomeIcon
                                                            icon={faPen}
                                                            color="#32A6E9"
                                                        />
                                                    </button>
                                                </td>
                                                <td>
                                                    {propertyRecord.image ? (
                                                        <button
                                                            className="iconButton"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setCurrentImage(
                                                                    propertyRecord.image
                                                                );
                                                                setShowImageModal(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faImage}
                                                                color="#32A6E9"
                                                                size="2x"
                                                            />
                                                        </button>
                                                    ) : (
                                                        <button className="iconButton">
                                                            <FontAwesomeIcon
                                                                icon={faImage}
                                                                color="#AEAEAE"
                                                                size="2x"
                                                                title="No image"
                                                            />
                                                        </button>
                                                    )}
                                                </td>
                                                <td>
                                                    {propertyRecord.section}
                                                </td>
                                                <td>{propertyRecord.town}</td>
                                                <td>{propertyRecord.rng}</td>
                                                <td>
                                                    {propertyRecord.subdivision}
                                                </td>
                                                <td>
                                                    {propertyRecord.description}
                                                </td>
                                                <td>
                                                    <button
                                                        className="iconButton"
                                                        onClick={(e) =>
                                                            handleDeletePropertyRecord(
                                                                index,
                                                                propertyRecord.id,
                                                                jwt,
                                                                setShowLoadingModal,
                                                                dispatch
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrashAlt}
                                                            color="#FF0000"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyRecordsManagement;
