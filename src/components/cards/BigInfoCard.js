import React from 'react';
import PropTypes from 'prop-types';
import "../../style/components/BigInfoCard.css";

const BigInfoCard = ({ className, title, info }) => {
    return (
        <div className={`big-card-info ${className}`}>
            <span className="big-card-title">{title}</span>
            <span className="big-card-info-value">{info}</span>
        </div>
    );
};

BigInfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    info: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    className: PropTypes.string,
};

export default BigInfoCard;
