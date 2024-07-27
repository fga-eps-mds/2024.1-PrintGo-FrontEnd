import React from 'react';
import PropTypes from 'prop-types';
import "../../style/components/InputContainer.css";

const InputContainer = ({ label, placeholder, value, onChange, className, error }) => {
    return (
        <div className={`input-label`}>
            <span className="form-subtitle">{label}</span>
            <div className="input-container">
                <input
                    id={label}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={error ? `input-field ${className} input-error` : `input-field ${className}`}
                />
            </div>
        </div>
    );
};

InputContainer.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    error: PropTypes.string,
};

InputContainer.defaultProps = {
    placeholder: '',
    error: '',
};

export default InputContainer;

