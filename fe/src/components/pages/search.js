import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { GET_ALL_PROPERTY_RECORDS_URL, LOGIN_ROUTE } from "../../constants";
import ProjectNavbar from "../widgets/projectNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
    addAllPropertyRecords,
    removeAllPropertyRecords,
} from "./../../redux/property_record/propertyRecordActions";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";

const Search = () => {
    const dispatch = useDispatch();
    const propertyRecords = useSelector(
        (state) => state.propertyRecordReducer.propertyRecords
    );

    useEffect(() => {
        axios
            .get(GET_ALL_PROPERTY_RECORDS_URL)
            .then((response) => {
                dispatch(addAllPropertyRecords(response.data["hydra:member"]));
                console.log(
                    `all admins = ${JSON.stringify(
                        response.data["hydra:member"]
                    )}`
                );
            })
            .catch((error) => {});
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllPropertyRecords());
        };
    }, [dispatch]);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    function handleItemsPerPageChange(e, newItemsPerPage) {
        e.preventDefault();

        setItemsPerPage(newItemsPerPage);
    }

    return (
        <div>
            <div className="m-4">
                <h2>Property Records</h2>
                <div className="my-4">
                    Show
                    <Dropdown
                        isOpen={dropdownOpen}
                        toggle={toggle}
                        className="d-inline mx-2"
                    >
                        <DropdownToggle caret>{itemsPerPage}</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                onClick={(e) => handleItemsPerPageChange(e, 10)}
                            >
                                10
                            </DropdownItem>
                            <DropdownItem
                                onClick={(e) => handleItemsPerPageChange(e, 25)}
                            >
                                25
                            </DropdownItem>
                            <DropdownItem
                                onClick={(e) => handleItemsPerPageChange(e, 50)}
                            >
                                50
                            </DropdownItem>
                            <DropdownItem
                                onClick={(e) =>
                                    handleItemsPerPageChange(e, 100)
                                }
                            >
                                100
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    entries
                </div>
                <table className="table table-responsive table-striped table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Section</th>
                            <th scope="col">Town</th>
                            <th scope="col">Range</th>
                            <th scope="col">Subdivision</th>
                            <th scope="col">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propertyRecords.map((propertyRecord, index) => {
                            return (
                                <tr key={propertyRecord.id}>
                                    <td>{propertyRecord.image}</td>
                                    <td>{propertyRecord.section}</td>
                                    <td>{propertyRecord.town}</td>
                                    <td>{propertyRecord.rng}</td>
                                    <td>{propertyRecord.subdivision}</td>
                                    <td>{propertyRecord.description}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <Pagination aria-label="Page navigation example" className="justify-content-center">
                    <PaginationItem>
                        <PaginationLink first href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink previous href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">4</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">5</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink next href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink last href="#" />
                    </PaginationItem>
                </Pagination>
            </div>
        </div>
    );
};

export default Search;
