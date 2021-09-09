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
import {
    faArrowDown,
    faArrowUp,
    faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageModal from "../widgets/imageModal";

const Search = () => {
    const dispatch = useDispatch();
    const jwt = useSelector((state) => state.authReducer.jwt);
    const propertyRecords = useSelector(
        (state) => state.propertyRecordReducer.propertyRecords
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageRecordId, setCurrentImageRecordId] = useState(null);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [section, setSection] = useState(0);
    const [town, setTown] = useState(0);
    const [range, setRange] = useState(0);
    const [subdivision, setSubdivision] = useState("");

    const [sectionSort, setSectionSort] = useState("");
    const [townSort, setTownSort] = useState("");
    const [rangeSort, setRangeSort] = useState("");
    const [subdivisionSort, setSubdivisionSort] = useState("");
    const [descriptionSort, setDescriptionSort] = useState("");

    function handleItemsPerPageChange(e, newItemsPerPage) {
        e.preventDefault();

        setItemsPerPage(newItemsPerPage);
    }

    function getSearchUrl() {
        return `${GET_ALL_PROPERTY_RECORDS_URL}?itemsPerPage=${itemsPerPage}&page=${pageNumber}
        ${sectionSort !== "" ? `&order[section]=${sectionSort}` : ""}
        ${townSort !== "" ? `&order[town]=${townSort}` : ""}
        ${rangeSort !== "" ? `&order[rng]=${rangeSort}` : ""}
        ${
            subdivisionSort !== ""
                ? `&order[subdivision]=${subdivisionSort}`
                : ""
        }
        ${
            descriptionSort !== ""
                ? `&order[description]=${descriptionSort}`
                : ""
        }
        ${section > 0 ? `&section=${section}` : ""}
        ${town > 0 ? `&town=${town}` : ""}
        ${range > 0 ? `&rng=${range}` : ""}
        ${subdivision !== "" ? `&subdivision=${subdivision}` : ""}
        `;
    }

    useEffect(() => {
        // TODO: Use caching of data for pagination whereas sort and search will hit the api everytime
        // on first fetch we can fetch large amount of data(and cache them) and show only 10 or 20 data in UI
        // Now, for pagination we can use the cached data instead of hitting the api everytime
        axios
            .get(getSearchUrl())
            .then((response) => {
                setTotalItems(response.data["hydra:totalItems"]);
                dispatch(addAllPropertyRecords(response.data["hydra:member"]));
            })
            .catch((error) => {});
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllPropertyRecords());
        };
    }, [
        dispatch,
        itemsPerPage,
        pageNumber,
        sectionSort,
        townSort,
        rangeSort,
        subdivisionSort,
        descriptionSort,
    ]);

    const LOCAL_SECTION = "Section";
    const LOCAL_TOWN = "Town";
    const LOCAL_RANGE = "Range";
    const LOCAL_SUBDIVISION = "Subdivision";
    const LOCAL_DESCRIPTION = "Description";

    const handleFieldChange = (e, type) => {
        e.preventDefault();
        setPageNumber(1);
        if (type === LOCAL_SECTION) setSection(e.target.value);
        if (type === LOCAL_TOWN) setTown(e.target.value);
        if (type === LOCAL_RANGE) setRange(e.target.value);
        if (type === LOCAL_SUBDIVISION) setSubdivision(e.target.value);
    };

    const handleSortChange = (e, type) => {
        e.preventDefault();
        setPageNumber(1);
        if (type === LOCAL_SECTION) {
            setSectionSort(
                sectionSort === "" || sectionSort === "ASC" ? "DESC" : "ASC"
            );
            setTownSort("");
            setRangeSort("");
            setSubdivisionSort("");
            setDescriptionSort("");
        } else if (type === LOCAL_TOWN) {
            setTownSort(townSort === "" || townSort === "ASC" ? "DESC" : "ASC");
            setSectionSort("");
            setRangeSort("");
            setSubdivisionSort("");
            setDescriptionSort("");
        } else if (type === LOCAL_RANGE) {
            setRangeSort(
                rangeSort === "" || rangeSort === "ASC" ? "DESC" : "ASC"
            );
            setTownSort("");
            setSectionSort("");
            setSubdivisionSort("");
            setDescriptionSort("");
        } else if (type === LOCAL_SUBDIVISION) {
            setSubdivisionSort(
                subdivisionSort === "" || subdivisionSort === "ASC"
                    ? "DESC"
                    : "ASC"
            );
            setTownSort("");
            setSectionSort("");
            setRangeSort("");
            setDescriptionSort("");
        } else if (type === LOCAL_DESCRIPTION) {
            setDescriptionSort(
                descriptionSort === "" || descriptionSort === "ASC"
                    ? "DESC"
                    : "ASC"
            );
            setTownSort("");
            setSectionSort("");
            setRangeSort("");
            setSubdivisionSort("");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();

        axios
            .get(getSearchUrl())
            .then((response) => {
                setTotalItems(response.data["hydra:totalItems"]);
                dispatch(addAllPropertyRecords(response.data["hydra:member"]));
            })
            .catch((error) => {});
    };

    var paginationLinks = [];
    for (var i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        paginationLinks.push(i);
    }

    return (
        <div>
            <div className="m-4">
                <h2>Property Records</h2>
                {jwt !== null && jwt !== "" ? (
                    <Link to={LOGIN_ROUTE} className="nounderline float-end">
                        Go to Admin Portal
                    </Link>
                ) : (
                    <div className="float-end">
                        Admin?{" "}
                        <Link to={LOGIN_ROUTE} className="nounderline">
                            Login
                        </Link>
                    </div>
                )}
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="rounded-3 shadow p-4 mx-auto mt-3">
                        <p className="mb-3 fs-2">Search</p>
                        {showImageModal ? (
                            <ImageModal
                                currentImageRecordId={currentImageRecordId}
                                setShowImageModal={setShowImageModal}
                            />
                        ) : null}
                        <form onSubmit={handleSearch}>
                            <Input
                                className="search-input m-2"
                                label="false"
                                placeholder={LOCAL_SECTION}
                                type="number"
                                min={1}
                                onChange={(e) =>
                                    handleFieldChange(e, LOCAL_SECTION)
                                }
                            />
                            <Input
                                className="search-input m-2"
                                label="false"
                                placeholder={LOCAL_TOWN}
                                type="number"
                                min={1}
                                onChange={(e) =>
                                    handleFieldChange(e, LOCAL_TOWN)
                                }
                            />
                            <Input
                                className="search-input m-2"
                                label="false"
                                placeholder={LOCAL_RANGE}
                                type="number"
                                min={1}
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

                {propertyRecords.length !== 0 ? (
                    <table className="table table-responsive table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Image</th>
                                <th
                                    scope="col"
                                    onClick={(e) => {
                                        handleSortChange(e, LOCAL_SECTION);
                                    }}
                                >
                                    Section{" "}
                                    {sectionSort === "ASC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowUp}
                                            title="Sort is ASC"
                                        />
                                    ) : sectionSort === "DESC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowDown}
                                            title="Sort is DESC"
                                        />
                                    ) : null}
                                </th>
                                <th
                                    scope="col"
                                    onClick={(e) => {
                                        handleSortChange(e, LOCAL_TOWN);
                                    }}
                                >
                                    Town{" "}
                                    {townSort === "ASC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowUp}
                                            title="Sort is ASC"
                                        />
                                    ) : townSort === "DESC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowDown}
                                            title={"Sort is DESC"}
                                        />
                                    ) : null}
                                </th>
                                <th
                                    scope="col"
                                    onClick={(e) => {
                                        handleSortChange(e, LOCAL_RANGE);
                                    }}
                                >
                                    Range{" "}
                                    {rangeSort === "ASC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowUp}
                                            title="Sort is ASC"
                                        />
                                    ) : rangeSort === "DESC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowDown}
                                            title="Sort is DESC"
                                        />
                                    ) : null}
                                </th>
                                <th
                                    scope="col"
                                    onClick={(e) => {
                                        handleSortChange(e, LOCAL_SUBDIVISION);
                                    }}
                                >
                                    Subdivision{" "}
                                    {subdivisionSort === "ASC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowUp}
                                            title="Sort is ASC"
                                        />
                                    ) : subdivisionSort === "DESC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowDown}
                                            title="Sort is DESC"
                                        />
                                    ) : null}
                                </th>
                                <th
                                    scope="col"
                                    onClick={(e) => {
                                        handleSortChange(e, LOCAL_DESCRIPTION);
                                    }}
                                >
                                    Description{" "}
                                    {descriptionSort === "ASC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowUp}
                                            title="Sort is ASC"
                                        />
                                    ) : descriptionSort === "DESC" ? (
                                        <FontAwesomeIcon
                                            icon={faArrowDown}
                                            title="Sort is DESC"
                                        />
                                    ) : null}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {propertyRecords.map((propertyRecord, index) => {
                                return (
                                    <tr key={propertyRecord.id}>
                                        <td>
                                            {propertyRecord.image ? (
                                                <button
                                                    className="iconButton"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentImageRecordId(
                                                            propertyRecord.id
                                                        );
                                                        setShowImageModal(true);
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
                ) : (
                    <h3 className="text-center mt-5">No data Available</h3>
                )}

                <Pagination
                    aria-label="Page navigation example"
                    className="justify-content-center"
                >
                    {paginationLinks.map((_, index) => (
                        <PaginationItem
                            key={index + 1}
                            active={pageNumber === index + 1}
                        >
                            <PaginationLink
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (pageNumber !== index + 1)
                                        setPageNumber(index + 1);
                                }}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                </Pagination>
            </div>
        </div>
    );
};

export default Search;
