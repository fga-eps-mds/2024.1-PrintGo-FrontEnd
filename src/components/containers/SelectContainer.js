import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../../style/components/SelectContainer.css";

const SelectContainer = ({ id, name, options, className, label, onChange, value, error }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e) => {
        setLocalValue(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={`select-container`}>
            <span className="form-subtitle">{label}</span>
            <div>
                <select
                    id={id}
                    name={name}
                    className={error ? `${className} input-error` : className}
                    onChange={handleChange}
                    value={localValue}
                >
                    <option value="">Selecione</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

SelectContainer.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.string,
    error: PropTypes.string
};

SelectContainer.defaultProps = {
    className: '',
    onChange: null,
    value: '',
    error: ''
};

export default SelectContainer;


