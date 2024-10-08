import React from 'react';
import PropTypes from 'prop-types';
import "../../style/components/DateContainer.css";

const DateContainer = ({ label, value, onChange, className, error }) => {
    return (
        <div className='date-container-form'>
            <label htmlFor={label} className="form-subtitle">{label}</label>
            <div>
                <input
                    type="date"
                    value={value}
                    onChange={onChange}
                    className={error ? `input-error ${className}` : `number-field ${className}`}
                    data-testid= {`date-container-${label}`}
                />
            </div>
        </div>
    );
};

DateContainer.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    error: PropTypes.string,
};

DateContainer.defaultProps = {
    value: '',
    className: '',
    error: '',
};

export default DateContainer;

