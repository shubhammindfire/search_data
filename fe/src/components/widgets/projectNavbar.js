import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import {
    ADMIN_MANAGEMENT_ROUTE,
    LOGIN_ROUTE,
    PROPERTY_RECORDS_MANAGEMENT_ROUTE,
} from "../../constants";
import {
    removeAuthJwt,
    removeCurrentAdmin,
} from "./../../redux/auth/authActions";

const ProjectNavbar = () => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);

    function handleLogout(e) {
        e.preventDefault();
        dispatch(removeAuthJwt());
        dispatch(removeCurrentAdmin());
        localStorage.removeItem("session-jwt");
        localStorage.removeItem("current-admin");
    }

    return (
        <div>
            <Navbar color="faded" className="mx-4" light>
                <NavbarBrand href="/" className="mr-auto">
                    Admin Dashboard
                </NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        <NavItem>
                            <NavLink href={ADMIN_MANAGEMENT_ROUTE}>
                                Admin Management
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={PROPERTY_RECORDS_MANAGEMENT_ROUTE}>
                                Property Records Management
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={LOGIN_ROUTE} onClick={handleLogout}>
                                Logout
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default ProjectNavbar;
