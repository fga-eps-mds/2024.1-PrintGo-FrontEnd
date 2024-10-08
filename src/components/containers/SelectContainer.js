import React from 'react';
import PropTypes from 'prop-types';
import "../../style/components/SelectContainer.css";


const SelectContainer = ({ id, name, options, className, label, containerStyle, onChange, value, error, placeHolder, usePlaceholder }) => {
    return (
        <div className={`select-container ${containerStyle}`}>
            <span className="form-subtitle">{label}</span>
            <div>
                <select
                    id={id}
                    name={name}
                    data-testid={id}
                    className={error ? `${className} input-error` : className}
                    onChange={onChange}
                    value={value}
                >
                    {usePlaceholder && <option value="">{placeHolder}</option>}
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
    error: PropTypes.string,
    placeHolder: PropTypes.string,
    containerStyle: PropTypes.string,
    usePlaceholder: PropTypes.bool
};

SelectContainer.defaultProps = {
    className: '',
    onChange: null,
    value: '',
    error: '',
    placeHolder: 'Selecione',
    error: '',
    containerStyle: '',
    usePlaceholder: true
};

export default SelectContainer;

