import React from 'react';
import PropTypes from 'prop-types';
import "../../style/components/SmallInfoCard.css";

const SmallInfoCard = ({ className, title, imageSrc, info }) => {
    const titleClass = className === 'grey-info-card' ? 'info-card-title' : 'blue-info-card-title';
    const infoClass = className === 'grey-info-card' ? 'info-card-info' : 'blue-info-card-info';
    return (
        <div className={className}>
            <img src={imageSrc} alt={title} className="info-card-image" />
            <div className="info-card-content">
                <span className={titleClass}>{title}</span>
                <span className={infoClass}>{info}</span>
            </div>
        </div>
    );
};

SmallInfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default SmallInfoCard;
