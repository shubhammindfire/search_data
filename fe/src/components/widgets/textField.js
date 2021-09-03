import React from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";

function TextField(props) {
    const {
        label,
        placeholder,
        type,
        autofocus = false,
        defaultValue = "",
        onChange,
    } = props;
    return (
        <div>
            {label !== "false" ? <label htmlFor={label}>{label}</label> : null}
            <Input
                type={type}
                name={label}
                id={label}
                placeholder={placeholder}
                onChange={onChange}
                autoFocus={autofocus}
                className="mt-2 mb-2"
                defaultValue={defaultValue}
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
