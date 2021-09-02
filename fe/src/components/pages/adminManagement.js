import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { GET_ALL_ADMINS_URL, LOGIN_ROUTE } from "../../constants";
import { addAllAdmins, removeAllAdmins } from "../../redux/admin/adminActions";
import ProjectNavbar from "../widgets/projectNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./../../styles/adminManagement.css";
import { Button } from "reactstrap";
import handleDeleteAdmin from "./../utils/deleteAdmin";
import LoadingModal from "../widgets/loadingModel";
import handleAddAdmin from "../utils/addAdmin";
import AddAdminModal from "../widgets/addAdminModal";

const AdminManagement = () => {
    const dispatch = useDispatch();
    const admins = useSelector((state) => state.adminReducer.admins);
    const jwt = useSelector((state) => state.authReducer.jwt);
    const currentAdmin = useSelector((state) => state.authReducer.currentAdmin);
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);

    useEffect(() => {
        axios
            .get(GET_ALL_ADMINS_URL, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                dispatch(addAllAdmins(response.data["hydra:member"]));
                console.log(
                    `all admins = ${JSON.stringify(
                        response.data["hydra:member"]
                    )}`
                );
            })
            .catch((error) => {
                if (error.response.data.code === 401) {
                    setIsSessionExpired(true);
                }
            });
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllAdmins());
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
                        <h2>Admins</h2>
                        {showLoadingModal ? <LoadingModal /> : null}
                        <Button
                            className="float-end bg-success border border-0"
                            title="Add a new Admin"
                            // onClick={(e) => {
                            //     e.preventDefault();
                            //     setShowAddAdminModal(true);
                            // }}
                        >
                            New
                        </Button>
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th scope="col">Edit</th>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin, index) => {
                                    return (
                                        <tr key={admin.email}>
                                            <td>
                                                <button className="iconButton">
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                        color="#32A6E9"
                                                    />
                                                </button>
                                            </td>
                                            <td>{admin.firstname}</td>
                                            <td>{admin.lastname}</td>
                                            <td>{admin.email}</td>
                                            {/* current admin can't delete oneself therefore delete icon is not shown */}
                                            <td>
                                                {currentAdmin.email !==
                                                admin.email ? (
                                                    <button
                                                        className="iconButton"
                                                        onClick={(e) =>
                                                            handleDeleteAdmin(
                                                                index,
                                                                admin.id,
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
                                                ) : null}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminManagement;
