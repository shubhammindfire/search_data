import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GET_ALL_PROPERTY_RECORDS_URL, LOGIN_ROUTE } from "../../constants";
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
    Input,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
import "./../../styles/search.css";

const Search = () => {
    const dispatch = useDispatch();
    const propertyRecords = useSelector(
        (state) => state.propertyRecordReducer.propertyRecords
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [section, setSection] = useState(null);
    const [town, setTown] = useState(null);
    const [range, setRange] = useState(null);
    const [subdivision, setSubdivision] = useState(null);

    function handleItemsPerPageChange(e, newItemsPerPage) {
        e.preventDefault();

        setItemsPerPage(newItemsPerPage);
    }

    useEffect(() => {
        axios
            .get(GET_ALL_PROPERTY_RECORDS_URL + `?itemsPerPage=${itemsPerPage}`)
            .then((response) => {
                dispatch(addAllPropertyRecords(response.data["hydra:member"]));
            })
            .catch((error) => {});
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllPropertyRecords());
        };
    }, [dispatch, itemsPerPage]);

    const LOCAL_SECTION = "Section";
    const LOCAL_TOWN = "Town";
    const LOCAL_RANGE = "Range";
    const LOCAL_SUBDIVISION = "Subdivision";

    const handleFieldChange = (e, type) => {
        e.preventDefault();
        if (type === LOCAL_SECTION) setSection(e.target.value);
        if (type === LOCAL_TOWN) setTown(e.target.value);
        if (type === LOCAL_RANGE) setRange(e.target.value);
        if (type === LOCAL_SUBDIVISION) setSubdivision(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <div className="m-4">
                <h2>Property Records</h2>
                <div className="float-end">
                    Admin?{" "}
                    <Link to={LOGIN_ROUTE} className="nounderline">
                        Login
                    </Link>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="rounded-3 shadow p-4">
                        <p className="mb-4 fs-1">Search</p>
                        <form onSubmit={handleSearch}>
                            <Input
                                className="search-input m-2"
                                label="false"
                                placeholder={LOCAL_SECTION}
                                type="number"
                                onChange={(e) =>
                                    handleFieldChange(e, LOCAL_SECTION)
                                }
                            />
                            <Input
                                className="search-input m-2"
                                label="false"
                                placeholder={LOCAL_TOWN}
                                type="number"
                                onChange={(e) =>
                                    handleFieldChange(e, LOCAL_TOWN)
                                }
                            />
                            <Input
                                className="search-input m-2"
                                label="false"
                                placeholder={LOCAL_RANGE}
                                type="number"
                                onChange={(e) =>
                                    handleFieldChange(e, LOCAL_RANGE)
                                }
                            />
                            <Input
                                className="search-input m-2"
                                label="false"
                                placeholder={LOCAL_SUBDIVISION}
                                type="text"
                                onChange={(e) =>
                                    handleFieldChange(e, LOCAL_SUBDIVISION)
                                }
                            />
                            <Button
                                type="submit"
                                color="primary"
                                className="mt-2 float-end"
                            >
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
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

                <Pagination
                    aria-label="Page navigation example"
                    className="justify-content-center"
                >
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
                </Pagination>
            </div>
        </div>
    );
};

export default Search;
