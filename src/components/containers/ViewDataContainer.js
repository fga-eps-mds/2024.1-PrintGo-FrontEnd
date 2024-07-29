import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../../style/components/ViewDataContainer.css";

const ViewDataContainer = ({ id, name, className, labelName, value }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={`view-data-container`}>
            <span className="form-subtitle">{labelName}</span>
            <label
            id={id}
            name={name}
            className={`${className} ${isHovered ? 'disabled-cursor' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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