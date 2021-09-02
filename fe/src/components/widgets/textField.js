import React from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";

function TextField(props) {
    const { label, placeholder, type, onChange } = props;
    return (
        <div>
            <label htmlFor={label}>{label}</label>
            <Input
                type={type}
                name={label}
                id={label}
                placeholder={placeholder}
                onChange={onChange}
                className="mt-2 mb-2"
            />
        </div>
    );
}

TextField.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default TextField;
