import React from 'react';
import PropTypes from 'prop-types';
import "../../style/components/ViewDataContainer.css";

const ViewDataContainer = ({ id, name, className, labelName, value }) => {
    return (
        <div className={`view-data-container`}>
            <span className="form-subtitle">{labelName}</span>
            <label
            id={id}
            name={name}
            className={className}
            >
                {value}
            </label>
        </div>
    );
};

ViewDataContainer.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    labelName: PropTypes.string.isRequired,
    value: PropTypes.string,
};

ViewDataContainer.defaultProps = {
    className: '',
    value: '',
};

export default ViewDataContainer;