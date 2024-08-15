import React from 'react';
import PropTypes from 'prop-types';
import "../../style/components/NumberContainer.css";

const NumberContainer = ({ id, name, value, onChange, className, label, disabled, error }) => {
    return (
        <div className='number-container-form'>
            <label htmlFor={id} className="form-subtitle">{label}</label>
            <div>
                <input
                    id={id}
                    name={name}
                    type="number"
                    className={error ? `input-error ${className} ` : `number-field ${className}`}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder="Insira"
                    min="0"
                />
            </div>
        </div>
    );
};

NumberContainer.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
};

NumberContainer.defaultProps = {
    value: '',
    onChange: null,
    className: '',
    disabled: false,
    error: '',
};

export default NumberContainer;

